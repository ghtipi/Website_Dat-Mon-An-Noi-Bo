<?php

namespace App\Http\Controllers\Api;

use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class MenuController extends Controller
{
    public function index()
    {
        $items = MenuItem::where('status', true)->get();
        return response()->json($items);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'string|nullable',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,_id',
            'image' => 'string|nullable',
            'status' => 'boolean',
            'stock' => 'integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $item = MenuItem::create($request->all());
        return response()->json($item, 201);
    }

    public function show($id)
    {
        $item = MenuItem::findOrFail($id);
        return response()->json($item);
    }

    public function update(Request $request, $id)
    {
        $item = MenuItem::findOrFail($id);
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'description' => 'string|nullable',
            'price' => 'numeric|min:0',
            'category_id' => 'exists:categories,_id',
            'image' => 'string|nullable',
            'status' => 'boolean',
            'stock' => 'integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $item->update($request->all());
        return response()->json($item);
    }

    public function destroy($id)
    {
        $item = MenuItem::findOrFail($id);
        $item->delete();
        return response()->json(null, 204);
    }
}