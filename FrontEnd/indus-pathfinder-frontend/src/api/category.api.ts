import {
  axiosClient,
} from "./axiosClient";

import type {
  CategoryPageResponse,
  CategoryRequest,
  CategoryResponse,
  CategorySearchParams,
} from "../types/category.types";

/*
 * ==========================================================
 * BASE URL
 * ==========================================================
 */

const CATEGORY_BASE_URL =
  "/api/v1/admin/categories";

/*
 * ==========================================================
 * CREATE CATEGORY
 *
 * POST /api/v1/admin/categories
 * ==========================================================
 */

export async function createCategoryApi(
  request:
    CategoryRequest
): Promise<CategoryResponse> {
  const response =
    await axiosClient.post<CategoryResponse>(
      CATEGORY_BASE_URL,
      request
    );

  return response.data;
}

/*
 * ==========================================================
 * SEARCH CATEGORIES
 *
 * GET /api/v1/admin/categories/search
 * ==========================================================
 */

export async function searchCategoriesApi(
  params:
    CategorySearchParams
): Promise<CategoryPageResponse> {
  const response =
    await axiosClient.get<CategoryPageResponse>(
      `${CATEGORY_BASE_URL}/search`,
      {
        params: {
          search:
            params.search ?? "",

          status:
            params.status ||
            undefined,

          page:
            params.page,

          size:
            params.size,

          sortBy:
            params.sortBy,

          sortDir:
            params.sortDir,
        },
      }
    );

  return response.data;
}

/*
 * ==========================================================
 * UPDATE CATEGORY
 *
 * PUT /api/v1/admin/categories/{categoryId}
 * ==========================================================
 */

export async function updateCategoryApi(
  categoryId:
    number,
  request:
    CategoryRequest
): Promise<CategoryResponse> {
  const response =
    await axiosClient.put<CategoryResponse>(
      `${CATEGORY_BASE_URL}/${categoryId}`,
      request
    );

  return response.data;
}

/*
 * ==========================================================
 * DELETE CATEGORY
 *
 * DELETE /api/v1/admin/categories/{categoryId}
 * ==========================================================
 */

export async function deleteCategoryApi(
  categoryId:
    number
): Promise<string> {
  const response =
    await axiosClient.delete<string>(
      `${CATEGORY_BASE_URL}/${categoryId}`
    );

  return response.data;
}

/*
 * ==========================================================
 * ACTIVE CATEGORIES
 *
 * GET /api/v1/admin/categories/active
 *
 * Used in Organization Registration.
 * ==========================================================
 */

export async function getActiveCategoriesApi():
Promise<CategoryResponse[]> {
  const response =
    await axiosClient.get<CategoryResponse[]>(
      `${CATEGORY_BASE_URL}/active`
    );

  return response.data;
}