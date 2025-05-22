<?php

namespace App\Http\Controllers\Api;

use App\Models\Order;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Auth::user()->isAdmin()
            ? Order::all()
            : Order::where('user_id', Auth::id())->get();
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array',
            'items.*.menu_id' => 'required|exists:menu,_id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.note' => 'string|nullable',
            'note' => 'string|nullable',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $totalPrice = 0;
        foreach ($request->items as $item) {
            $menuItem = MenuItem::findOrFail($item['menu_id']);
            if ($menuItem->stock < $item['quantity']) {
                return response()->json(['error' => "Not enough stock for {$menuItem->name}"], 400);
            }
            $totalPrice += $menuItem->price * $item['quantity'];
        }

        $order = Order::create([
            'user_id' => Auth::id(),
            'items' => $request->items,
            'total_price' => $totalPrice,
            'status' => 'pending',
            'delivery_status' => 'pending',
            'order_time' => now(),
            'note' => $request->note,
        ]);

        foreach ($request->items as $item) {
            $menuItem = MenuItem::find($item['menu_id']);
            $menuItem->decrement('stock', $item['quantity']);
        }

        return response()->json($order, 201);
    }

    public function show($id)
    {
        $order = Order::findOrFail($id);
        if (Auth::user()->isAdmin() || $order->user_id == Auth::id()) {
            return response()->json($order);
        }
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $validator = Validator::make($request->all(), [
            'status' => 'in:pending,confirmed,delivered,cancelled',
            'delivery_status' => 'in:pending,preparing,delivered,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (!Auth::user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $order->update($request->only(['status', 'delivery_status']));
        return response()->json($order);
    }
}