<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    // Áp dụng middleware xác thực và phân quyền
    public function __construct()
    {
        $this->middleware('auth:api')->except(['index', 'show', 'randomCategories']);
        $this->middleware('role:admin')->only(['store', 'update', 'destroy']);
    }

    /**
     * Hiển thị danh sách tất cả danh mục
     */
    public function index()
    {
        $categories = Category::all();
        return response()->json($categories);
    }

    /**
     * Tạo danh mục mới
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:categories,slug',
            'parent_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|url',
            'description' => 'nullable|string',
            'status' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $category = Category::create($request->all());
        return response()->json([
            'message' => 'Category created successfully',
            'data' => $category
        ], 201);
    }

    /**
     * Hiển thị chi tiết một danh mục
     */
    public function show($id)
    {
        try {
            $category = Category::findOrFail($id);
            return response()->json($category);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Category not found'], 404);
        }
    }

    /**
     * Cập nhật danh mục
     */
    public function update(Request $request, $id)
    {
        try {
            $category = Category::findOrFail($id);
            $validator = Validator::make($request->all(), [
                'name' => 'string|max:255',
                'slug' => 'string|max:255|unique:categories,slug,' . $category->id,
                'parent_id' => 'nullable|exists:categories,id',
                'image' => 'nullable|url',
                'description' => 'nullable|string',
                'status' => 'boolean',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $category->update($request->all());
            return response()->json([
                'message' => 'Category updated successfully',
                'data' => $category
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Category not found'], 404);
        }
    }

    /**
     * Xóa danh mục
     */
    public function destroy($id)
    {
        try {
            $category = Category::findOrFail($id);
            $category->delete();
            return response()->json(['message' => 'Category deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Category not found'], 404);
        }
    }

    /**
     * Lấy ngẫu nhiên 5 danh mục để hiển thị trên trang chủ
     */
    public function randomCategories()
    {
        $categories = Category::all()->shuffle()->take(5)->values();
        return response()->json($categories);
    }

    /**
     * Lấy danh sách các danh mục cha (không có parent_id)
     */
    public function getParentCategories()
    {
        $parentCategories = Category::whereNull('parent_id')->get();
        return response()->json($parentCategories);
    }

    /**
     * Lấy danh sách các danh mục con theo danh mục cha
     */
    public function getChildCategories($parentId)
    {
        try {
            $childCategories = Category::where('parent_id', $parentId)->get();
            return response()->json($childCategories);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Parent category not found'], 404);
        }
    }

    /**
     * Tìm kiếm và lọc danh mục
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        $query = Category::query();

        // Tìm kiếm theo tên
        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        // Lọc theo trạng thái
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Lọc theo danh mục cha
        if ($request->has('parent_id')) {
            $query->where('parent_id', $request->parent_id);
        }

        // Sắp xếp
        $sortField = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Phân trang
        $perPage = $request->input('per_page', 10);
        $categories = $query->paginate($perPage);

        return response()->json([
            'data' => $categories->items(),
            'pagination' => [
                'total' => $categories->total(),
                'per_page' => $categories->perPage(),
                'current_page' => $categories->currentPage(),
                'last_page' => $categories->lastPage(),
            ]
        ]);
    }
}