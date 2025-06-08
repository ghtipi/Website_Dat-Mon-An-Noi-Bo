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
    //Người dùng - lấy danh sách món ăn top
    public function PopularItems(Request $request)
    {
        $MenuItem = MenuItem::raw(function ($collection) {
            return $collection->aggregate([
                ['$match' => ['status' => 'active']],
                ['$sample' => ['size' => 4]],
            ]);
        });

        return response()->json($MenuItem);
    }

    // Người dùng - xem 6 món ngẫu nhiên 
    public function randomItems(Request $request)
    {
        $MenuItem = MenuItem::raw(function ($collection) {
            return $collection->aggregate([
                ['$match' => ['status' => 'active']],
                ['$sample' => ['size' => 6]],
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
        // Lọc theo danh mục
        if ($request->filled('category_id')) {
            $categoryId = $request->input('category_id');
            $query->where('category_id', $categoryId);
        }
 
        // Lọc theo nhiều danh mục
        if ($request->filled('category_ids')) {
            $categoryIds = $request->input('category_ids');
            if (is_string($categoryIds)) {
                $categoryIds = explode(',', $categoryIds);
            }
            $categoryIds = array_map('trim', $categoryIds);
            $query->whereIn('category_id', $categoryIds);
        }

        // Lọc theo khoảng giá
        if ($request->filled('price_min') && is_numeric($request->input('price_min'))) {
            $query->where('price', '>=', (float) $request->input('price_min'));
        }

        if ($request->filled('price_max') && is_numeric($request->input('price_max'))) {
            $query->where('price', '<=', (float) $request->input('price_max'));
        }

        // Lọc theo tồn kho
        if ($request->filled('in_stock') && $request->input('in_stock') == '1') {
            $query->where('stock', '>', 0);
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

        // Sắp xếp
        if ($request->filled('sort_by')) {
            $sortBy = $request->input('sort_by');
            $sortOrder = $request->input('sort_order', 'asc');
            
            switch ($sortBy) {
                case 'price':
                    $query->orderBy('price', $sortOrder);
                    break;
                case 'name':
                    $query->orderBy('name', $sortOrder);
                    break;
                case 'created_at':
                    $query->orderBy('created_at', $sortOrder);
                    break;
                default:
                    $query->orderBy('created_at', 'desc');
            }
        } else {
            $query->orderBy('created_at', 'desc');
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

    // Admin cập nhật món
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

    // Người dùng - Xem danh sách tất cả món ăn có phân trang (dành cho menupage)
    public function menuPage(Request $request)
    {
        $query = MenuItem::where('status', 'active');
        $this->applyFilters($query, $request);

        $perPage = $request->input('per_page', 12); // Số món mỗi trang (mặc định 12)
        $items = $query->paginate($perPage);

        return response()->json($items);
    }
}
