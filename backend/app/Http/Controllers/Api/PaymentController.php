<?php

namespace App\Http\Controllers\Api;

use App\Models\Payment;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Auth::user()->isAdmin()
            ? Payment::all()
            : Payment::where('user_id', Auth::id())->get();
        return response()->json($payments);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,_id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,card,online',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $order = Order::findOrFail($request->order_id);
        if (!Auth::user()->isAdmin() && $order->user_id != Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $payment = Payment::create([
            'order_id' => $request->order_id,
            'user_id' => $order->user_id,
            'amount' => $request->amount,
            'status' => 'pending',
            'payment_method' => $request->payment_method,
            'payment_date' => now(),
        ]);

        return response()->json($payment, 201);
    }

    public function show($id)
    {
        $payment = Payment::findOrFail($id);
        if (Auth::user()->isAdmin() || $payment->user_id == Auth::id()) {
            return response()->json($payment);
        }
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);
        $validator = Validator::make($request->all(), [
            'status' => 'in:pending,completed,failed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (!Auth::user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $payment->update($request->only(['status']));
        return response()->json($payment);
    }
}