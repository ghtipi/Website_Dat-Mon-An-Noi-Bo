<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    public function pay(Request $request, $orderId)
    {
        $order = Order::findOrFail($orderId);

        if ($order->user_id != Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'method' => 'required|string|in:cash,card,bank_transfer'
        ]);

        $payment = Payment::create([
            'order_id' => $orderId,
            'amount' => $order->total_price,
            'method' => $request->method,
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        $order->update(['status' => 'confirmed']);

        return response()->json(['message' => 'Payment successful', 'payment' => $payment]);
    }
}
