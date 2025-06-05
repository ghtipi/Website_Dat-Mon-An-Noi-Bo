<?php

namespace App\Http\Controllers\Api;

use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class MenuController extends Controller
{
    // Người dùng - chỉ xem món active
    public function index(Request $request)
    {
        $query = MenuItem::where('status', 'active');
        $this->applyFilters($query, $request);
        $items = $query->get();
        return response()->json($items);
    }
    // Người dùng - xem 4 món ngẫu nhiên 
    public function randomItems(Request $request)
    {
        $MenuItem =MenuItem::raw(function ($collection) {
        return $collection->aggregate([
            ['$match' => ['status' => 'active']],
            ['$sample' => ['size' => 4]],
        ]);
    });

    return response()->json($MenuItem);
    }

    // Admin - xem tất cả món
    public function adminIndex(Request $request)
    {
        $query = MenuItem::query();
        $this->applyFilters($query, $request, true);
        return response()->json($query->get());
    }

    // Lọc chung
    protected function applyFilters($query, Request $request, $isAdmin = false)
    {
        // Lọc theo danh mục (nhiều danh mục)
        if ($request->filled('category_ids')) {
            $categoryIds = $request->input('category_ids');

            if (is_string($categoryIds)) {
                $categoryIds = explode(',', $categoryIds);
            }

            $categoryIds = array_map('trim', $categoryIds);

            $query->where(function ($q) use ($categoryIds) {
                foreach ($categoryIds as $id) {
                    // Tìm kiếm trong chuỗi JSON chứa mảng category_ids
                    $q->orWhere('category_ids', 'like', '%"' . $id . '"%');
                }
            });
        }

        // Lọc theo khoảng giá
        if ($request->filled('price_min') && is_numeric($request->input('price_min'))) {
            $query->where('price', '>=', (float) $request->input('price_min'));
        }

        if ($request->filled('price_max') && is_numeric($request->input('price_max'))) {
            $query->where('price', '<=', (float) $request->input('price_max'));
        }

        // Lọc theo trạng thái (chỉ admin)
        if ($isAdmin && $request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Tìm kiếm theo tên hoặc mô tả
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
    }

    // Người dùng xem chi tiết món active
    public function show($id)
    {
        $item = MenuItem::where('_id', $id)
                        ->where('status', 'active')
                        ->firstOrFail();
        return response()->json($item);
    }

    // Admin xem chi tiết bất kỳ món nào
    public function adminShow($id)
    {
        $item = MenuItem::where('_id', $id)->firstOrFail();
        return response()->json($item);
    }

    // Admin thêm món mới
    public function adminStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'string|nullable',
            'price' => 'required|numeric|min:0',
            'category_ids' => 'required|array',
            'category_ids.*' => 'string',
            'image' => 'string|nullable',
            'status' => 'nullable|string|in:active,inactive',
            'stock' => 'integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $item = MenuItem::create($request->all());
        return response()->json($item, 201);
    }

    // Admin cập nhật món
    public function adminUpdate(Request $request, $id)
    {
        $item = MenuItem::where('_id', $id)->firstOrFail();

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'description' => 'string|nullable',
            'price' => 'numeric|min:0',
            'category_ids' => 'array|nullable',
            'category_ids.*' => 'string',
            'image' => 'string|nullable',
            'status' => 'nullable|string|in:active,inactive',
            'stock' => 'integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $item->update($request->all());
        return response()->json($item);
    }

    // Admin xoá món
    public function adminDestroy($id)
    {
        $item = MenuItem::where('_id', $id)->firstOrFail();
        $item->delete();
        return response()->json(null, 204);
    }
}
