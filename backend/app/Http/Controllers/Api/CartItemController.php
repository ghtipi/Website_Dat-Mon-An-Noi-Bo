<?php

namespace App\Http\Controllers\Api;

use App\Models\CartItem;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class CartItemController extends Controller
{
    // Xem tất cả sản phẩm trong giỏ hàng của user
    public function index()
    {
        $cartItems = CartItem::where('user_id', Auth::id())
            ->with('menuItem')
            ->get()
            ->map(function ($item) {
                return [
                    '_id' => $item->_id,
                    'menu_id' => $item->menu_id,
                    'quantity' => $item->quantity,
                    'note' => $item->note,
                    'user_id' => $item->user_id,
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
                    'menu_item' => $item->menuItem
                ];
            });
        return response()->json($cartItems);
    }

    // Thêm sản phẩm vào giỏ hàng
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'menu_id' => 'required|exists:menu_items,_id',
            'quantity' => 'required|integer|min:1|max:99',
            'note' => 'nullable|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Kiểm tra menu item có tồn tại và còn hoạt động
        $menuItem = MenuItem::find($request->menu_id);
        if (!$menuItem || $menuItem->status !== 'active') {
            return response()->json(['message' => 'Sản phẩm không tồn tại hoặc đã ngừng bán'], 404);
        }

        // Kiểm tra nếu sản phẩm đã có trong giỏ thì cộng thêm số lượng
        $existing = CartItem::where('user_id', Auth::id())
            ->where('menu_id', $request->menu_id)
            ->first();

        if ($existing) {
            $newQuantity = $existing->quantity + $request->quantity;
            if ($newQuantity > 99) {
                return response()->json(['message' => 'Số lượng tối đa cho mỗi sản phẩm là 99'], 422);
            }
            $existing->quantity = $newQuantity;
            if ($request->note) {
                $existing->note = $request->note;
            }
            $existing->save();
            return response()->json($existing->load('menuItem'), 200);
        }

        // Tạo mới nếu chưa có
        $cartItem = CartItem::create([
            'user_id' => Auth::id(),
            'menu_id' => $request->menu_id,
            'quantity' => $request->quantity,
            'note' => $request->note
        ]);

        return response()->json($cartItem->load('menuItem'), 201);
    }

    // Cập nhật số lượng hoặc ghi chú
    public function update(Request $request, $id)
    {
        $cartItem = CartItem::where('_id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'quantity' => 'integer|min:1|max:99',
            'note' => 'nullable|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->has('quantity')) {
            $cartItem->quantity = $request->quantity;
        }
        if ($request->has('note')) {
            $cartItem->note = $request->note;
        }

        $cartItem->save();
        return response()->json($cartItem->load('menuItem'));
    }

    // Xóa một sản phẩm khỏi giỏ
    public function destroy($id)
    {
        $cartItem = CartItem::where('_id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $cartItem->delete();
        return response()->json(['message' => 'Item removed']);
    }

    // Xóa toàn bộ giỏ hàng của user
    public function clear()
    {
        CartItem::where('user_id', Auth::id())->delete();
        return response()->json(['message' => 'Cart cleared']);
    }
}
