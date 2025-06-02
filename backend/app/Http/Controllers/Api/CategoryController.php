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
    public function indexAdmin()
    {
        $categories = Category::all();
        return response()->json($categories);
    }
    public function index()
    {
        $categories = Category::raw(function ($collection) {
        return $collection->aggregate([
            ['$match' => ['status' => 'active']],
        ]);
    });
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
            'image' => 'nullable|url',
            'description' => 'nullable|string',
            'status' => 'nullable|string',
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
                'image' => 'nullable|url',
                'description' => 'nullable|string',
                'status' => 'nullable|string',
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
    $categories = Category::raw(function ($collection) {
        return $collection->aggregate([
            ['$match' => ['status' => 'active']],
            ['$sample' => ['size' => 5]],
        ]);
    });

    return response()->json($categories);
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