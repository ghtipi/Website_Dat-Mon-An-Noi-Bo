<?php

namespace App\Http\Controllers\Api;

use App\Models\Promotion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class PromotionController extends Controller
{
    public function index()
    {
        $promotions = Promotion::where('status', 'active')->get();
        return response()->json($promotions);
    }

    public function store(Request $request)
    {
        if (!Auth::user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'code' => 'required|string|unique:promotions',
            'description' => 'string|nullable',
            'discount' => 'required|numeric|min:0',
            'status' => 'in:active,inactive',
            'valid_from' => 'date|nullable',
            'valid_until' => 'date|nullable',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $promotion = Promotion::create($request->all());
        return response()->json($promotion, 201);
    }

    public function show($id)
    {
        $promotion = Promotion::findOrFail($id);
        return response()->json($promotion);
    }

    public function update(Request $request, $id)
    {
        if (!Auth::user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $promotion = Promotion::findOrFail($id);
        $validator = Validator::make($request->all(), [
            'code' => 'string|unique:promotions,code,' . $id,
            'description' => 'string|nullable',
            'discount' => 'numeric|min:0',
            'status' => 'in:active,inactive',
            'valid_from' => 'date|nullable',
            'valid_until' => 'date|nullable',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $promotion->update($request->all());
        return response()->json($promotion);
    }

    public function destroy($id)
    {
        if (!Auth::user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $promotion = Promotion::findOrFail($id);
        $promotion->delete();
        return response()->json(null, 204);
    }
}