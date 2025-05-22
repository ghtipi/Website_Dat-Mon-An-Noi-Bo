<?php

namespace App\Http\Controllers\Api;

use App\Models\Invoice;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Auth::user()->isAdmin()
            ? Invoice::all()
            : Invoice::where('user_id', Auth::id())->get();
        return response()->json($invoices);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,_id',
            'total_amount' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $order = Order::findOrFail($request->order_id);
        if (!Auth::user()->isAdmin() && $order->user_id != Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $invoice = Invoice::create([
            'order_id' => $request->order_id,
            'user_id' => $order->user_id,
            'total_amount' => $request->total_amount,
            'status' => 'pending',
            'issue_date' => now(),
        ]);

        return response()->json($invoice, 201);
    }

    public function show($id)
    {
        $invoice = Invoice::findOrFail($id);
        if (Auth::user()->isAdmin() || $invoice->user_id == Auth::id()) {
            return response()->json($invoice);
        }
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    public function update(Request $request, $id)
    {
        $invoice = Invoice::findOrFail($id);
        $validator = Validator::make($request->all(), [
            'status' => 'in:pending,paid,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (!Auth::user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $invoice->update($request->only(['status']));
        return response()->json($invoice);
    }
}