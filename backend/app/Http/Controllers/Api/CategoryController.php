<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    // Người dùng - lấy danh sách category đang hoạt động
    public function index(Request $request)
    {
        $query = Category::where('status', 'active');

        // Tìm kiếm theo tên
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%");
        }

        $categories = $query->get();
        return response()->json($categories);
    }

    // Admin - lấy toàn bộ categories có thể lọc
    public function indexAdmin(Request $request)
    {
        $query = Category::query();

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%");
        }

        $categories = $query->get();
        return response()->json($categories);
    }

    // Người dùng - xem chi tiết category đang hoạt động
    public function show($id)
    {
        $category = Category::where('_id', $id)
                            ->where('status', 'active')
                            ->firstOrFail();
        return response()->json($category);
    }

    // Admin - xem chi tiết bất kỳ category nào
    public function adminShow($id)
    {
        $category = Category::where('_id', $id)->firstOrFail();
        return response()->json($category);
    }

    // Admin - thêm mới category
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'status' => 'nullable|in:active,inactive'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $category = Category::create($request->all());
        return response()->json($category, 201);
    }

    // Admin - cập nhật category
    public function update(Request $request, $id)
    {
        $category = Category::where('_id', $id)->firstOrFail();

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'status' => 'nullable|in:active,inactive'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $category->update($request->all());
        return response()->json($category);
    }

    // Admin - xoá category
    public function destroy($id)
    {
        $category = Category::where('_id', $id)->firstOrFail();
        $category->delete();
        return response()->json(null, 204);
    }

    // API đặc biệt: random categories (ví dụ 4 random cho trang chủ)
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

}