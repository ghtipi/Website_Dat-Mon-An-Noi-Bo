<?php

namespace App\Http\Controllers\Api;

use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class MenuController extends Controller
{
    // Dành cho người dùng - chỉ hiển thị các món có status 'active'
    public function index(Request $request)
    {
        $query = MenuItem::where('status', 'active');

        // Lọc theo danh mục
        if ($request->has('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        // Lọc theo giá
        if ($request->has('price_min') && is_numeric($request->input('price_min'))) {
            $query->where('price', '>=', (float) $request->input('price_min'));
        }
        if ($request->has('price_max') && is_numeric($request->input('price_max'))) {
            $query->where('price', '<=', (float) $request->input('price_max'));
        }

        // Tìm kiếm theo tên hoặc mô tả
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $items = $query->get();
        return response()->json($items);
    }

    // Dành cho admin - lấy toàn bộ menu với khả năng lọc và tìm kiếm
    public function adminIndex(Request $request)
    {
        $query = MenuItem::query();

        // Lọc theo danh mục
        if ($request->has('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        // Lọc theo giá
        if ($request->has('price_min') && is_numeric($request->input('price_min'))) {
            $query->where('price', '>=', (float) $request->input('price_min'));
        }
        if ($request->has('price_max') && is_numeric($request->input('price_max'))) {
            $query->where('price', '<=', (float) $request->input('price_max'));
        }

        // Lọc theo trạng thái
        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        // Tìm kiếm theo tên hoặc mô tả
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $items = $query->get();
        return response()->json($items);
    }

    // Người dùng xem chi tiết món (chỉ xem được món active)
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
            'category_id' => 'required|string',
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

    // Admin cập nhật món ăn
    public function adminUpdate(Request $request, $id)
    {
        $item = MenuItem::where('_id', $id)->firstOrFail();

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'description' => 'string|nullable',
            'price' => 'numeric|min:0',
            'category_id' => 'string',
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