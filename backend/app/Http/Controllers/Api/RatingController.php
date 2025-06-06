<?php

namespace App\Http\Controllers\Api;

use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class RatingController extends Controller
{
    public function index()
    {
        $ratings = Auth::user()->isAdmin()
            ? Rating::all()
            : Rating::where('user_id', Auth::id())->get();
        return response()->json($ratings);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'menu_id' => 'required|exists:menu,_id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'string|nullable',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $rating = Rating::create([
            'user_id' => Auth::id(),
            'menu_id' => $request->menu_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json($rating, 201);
    }

    public function show($id)
    {
        $rating = Rating::findOrFail($id);
        if (Auth::user()->isAdmin() || $rating->user_id == Auth::id()) {
            return response()->json($rating);
        }
        return response()->json(['error' => 'Unauthorized'], 403);
    }
}