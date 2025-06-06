<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ReportController extends Controller
{
    public function index()
    {
        if (!Auth::user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $reports = Report::all();
        return response()->json($reports);
    }

    public function store(Request $request)
    {
        if (!Auth::user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'type' => 'required|in:sales,orders,stock',
            'period' => 'required|in:daily,weekly,monthly',
            'custom_period.start_date' => 'date|nullable',
            'custom_period.end_date' => 'date|nullable',
            'data' => 'array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $report = Report::create([
            'type' => $request->type,
            'period' => $request->period,
            'custom_period' => $request->custom_period,
            'data' => $request->data,
            'generated_at' => now(),
        ]);

        return response()->json($report, 201);
    }

    public function show($id)
    {
        if (!Auth::user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $report = Report::findOrFail($id);
        return response()->json($report);
    }
}