from unittest.mock import MagicMock, patch

import httpx
import pytest
from pydantic import ValidationError

from core.rag.datasource.vdb.field import Field
from core.rag.datasource.vdb.milvus.milvus_vector import MilvusConfig, MilvusVector


def test_default_value():
    valid_config = {"uri": "http://localhost:19530", "user": "root", "password": "Milvus"}

    for key in valid_config:
        config = valid_config.copy()
        del config[key]
        with pytest.raises(ValidationError) as e:
            MilvusConfig.model_validate(config)
        assert e.value.errors()[0]["msg"] == f"Value error, config MILVUS_{key.upper()} is required"

    config = MilvusConfig.model_validate(valid_config)
    assert config.database == "default"


def _config(**kwargs):
    values = {"uri": "http://localhost:19530", "user": "root", "password": "Milvus"}
    values.update(kwargs)
    return MilvusConfig.model_validate(values)


def _vector(config: MilvusConfig | None = None):
    vector = MilvusVector.__new__(MilvusVector)
    vector._collection_name = "Vector_index_test"
    vector._client_config = config or _config()
    vector._client = MagicMock()
    vector._client.search.return_value = [
        [
            {
                "entity": {
                    Field.CONTENT_KEY: "content",
                    Field.METADATA_KEY: {},
                },
                "distance": 0.9,
            }
        ]
    ]
    vector._fields = [Field.SPARSE_VECTOR]
    vector._hybrid_search_enabled = True
    return vector


def test_search_by_vector_skips_lifecycle_manager_when_unconfigured():
    vector = _vector()

    with patch("core.rag.datasource.vdb.milvus.milvus_vector.httpx.post") as post:
        docs = vector.search_by_vector([0.1, 0.2])

    post.assert_not_called()
    vector._client.search.assert_called_once()
    assert len(docs) == 1


def test_search_by_vector_ensures_collection_loaded_before_search():
    vector = _vector(
        _config(
            lifecycle_manager_base_url="http://manager.local",
            lifecycle_manager_api_key="secret",
            lifecycle_manager_timeout=3,
        )
    )
    response = MagicMock()
    response.raise_for_status.return_value = None

    with patch(
        "core.rag.datasource.vdb.milvus.milvus_vector.httpx.post",
        return_value=response,
    ) as post:
        vector.search_by_vector([0.1, 0.2])

    post.assert_called_once_with(
        "http://manager.local/ensure-loaded",
        json={"collection_name": "Vector_index_test"},
        headers={"X-API-Key": "secret"},
        timeout=3,
    )
    vector._client.search.assert_called_once()


def test_search_by_full_text_ensures_collection_loaded_before_search():
    vector = _vector(
        _config(
            lifecycle_manager_base_url="http://manager.local/",
            lifecycle_manager_api_key="secret",
        )
    )
    response = MagicMock()
    response.raise_for_status.return_value = None

    with patch(
        "core.rag.datasource.vdb.milvus.milvus_vector.httpx.post",
        return_value=response,
    ) as post:
        vector.search_by_full_text("query")

    post.assert_called_once_with(
        "http://manager.local/ensure-loaded",
        json={"collection_name": "Vector_index_test"},
        headers={"X-API-Key": "secret"},
        timeout=10.0,
    )
    vector._client.search.assert_called_once()


def test_lifecycle_manager_error_blocks_search():
    vector = _vector(
        _config(
            lifecycle_manager_base_url="http://manager.local",
            lifecycle_manager_api_key="secret",
        )
    )
    request = httpx.Request("POST", "http://manager.local/ensure-loaded")
    response = httpx.Response(500, request=request, text="boom")

    with patch("core.rag.datasource.vdb.milvus.milvus_vector.httpx.post") as post:
        post.return_value.raise_for_status.side_effect = httpx.HTTPStatusError(
            "server error",
            request=request,
            response=response,
        )
        with pytest.raises(RuntimeError, match="Failed to ensure Milvus collection loaded"):
            vector.search_by_vector([0.1, 0.2])

    vector._client.search.assert_not_called()
