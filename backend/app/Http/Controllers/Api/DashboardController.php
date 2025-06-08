<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getAdminStats(Request $request)
    {
        try {
            // Lấy thống kê cơ bản
            $totalOrders = Order::count();
            $totalRevenue = Order::where('status', 'completed')->sum('total_price');
            $totalUsers = User::where('role', 'user')->count();
            $totalProducts = MenuItem::count();

            // Lấy thống kê ngày
            $today = Carbon::today();
            $yesterday = Carbon::yesterday();
            
            $todayOrders = Order::whereDate('created_at', $today)->count();
            $yesterdayOrders = Order::whereDate('created_at', $yesterday)->count();
            $orderChangePercent = $yesterdayOrders > 0 
                ? (($todayOrders - $yesterdayOrders) / $yesterdayOrders) * 100 
                : 0;

            $todayRevenue = Order::whereDate('created_at', $today)
                ->where('status', 'completed')
                ->sum('total_price');
            $yesterdayRevenue = Order::whereDate('created_at', $yesterday)
                ->where('status', 'completed')
                ->sum('total_price');
            $revenueChangePercent = $yesterdayRevenue > 0 
                ? (($todayRevenue - $yesterdayRevenue) / $yesterdayRevenue) * 100 
                : 0;

            $newUsers = User::whereDate('created_at', $today)->count();
            $yesterdayUsers = User::whereDate('created_at', $yesterday)->count();
            $userChangePercent = $yesterdayUsers > 0 
                ? (($newUsers - $yesterdayUsers) / $yesterdayUsers) * 100 
                : 0;

            $newProducts = MenuItem::whereDate('created_at', $today)->count();
            $yesterdayProducts = MenuItem::whereDate('created_at', $yesterday)->count();
            $productChangePercent = $yesterdayProducts > 0 
                ? (($newProducts - $yesterdayProducts) / $yesterdayProducts) * 100 
                : 0;

            // Tính giá trị đơn hàng trung bình
            $avgOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

            // Lấy 5 đơn hàng gần nhất
            $recentOrders = Order::with('user')
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($order) {
                    $products = collect($order->items)->map(function ($item) {
                        $menuItem = MenuItem::find($item['menu_id']);
                        return $menuItem ? $menuItem->name : 'Sản phẩm không tồn tại';
                    })->join(', ');

                    return [
                        'id' => $order->_id,
                        'customerName' => $order->user ? $order->user->name : 'Khách hàng',
                        'products' => $products,
                        'totalAmount' => $order->total_price,
                        'status' => $order->status,
                        'orderDate' => $order->created_at->format('Y-m-d H:i:s')
                    ];
                });

            return response()->json([
                'totalOrders' => $totalOrders,
                'totalRevenue' => $totalRevenue,
                'totalUsers' => $totalUsers,
                'totalProducts' => $totalProducts,
                'orderChangePercent' => round($orderChangePercent, 2),
                'revenueChangePercent' => round($revenueChangePercent, 2),
                'userChangePercent' => round($userChangePercent, 2),
                'productChangePercent' => round($productChangePercent, 2),
                'todayOrders' => $todayOrders,
                'todayRevenue' => $todayRevenue,
                'avgOrderValue' => round($avgOrderValue, 2),
                'newUsers' => $newUsers,
                'recentOrders' => $recentOrders
            ]);
        } catch (\Exception $e) {
            Log::error('Dashboard Error: ' . $e->getMessage());
            return response()->json(['message' => 'Có lỗi xảy ra khi tải dữ liệu thống kê'], 500);
        }
    }

    public function getManagerStats(Request $request)
    {
        try {
            // Lấy thống kê cơ bản
            $totalOrders = Order::count();
            $totalRevenue = Order::where('status', 'completed')->sum('total_price');
            $totalUsers = User::where('role', 'user')->count();
            $totalProducts = MenuItem::count();

            // Lấy thống kê ngày
            $today = Carbon::today();
            $yesterday = Carbon::yesterday();
            
            $todayOrders = Order::whereDate('created_at', $today)->count();
            $yesterdayOrders = Order::whereDate('created_at', $yesterday)->count();
            $orderChangePercent = $yesterdayOrders > 0 
                ? (($todayOrders - $yesterdayOrders) / $yesterdayOrders) * 100 
                : 0;

            $todayRevenue = Order::whereDate('created_at', $today)
                ->where('status', 'completed')
                ->sum('total_price');
            $yesterdayRevenue = Order::whereDate('created_at', $yesterday)
                ->where('status', 'completed')
                ->sum('total_price');
            $revenueChangePercent = $yesterdayRevenue > 0 
                ? (($todayRevenue - $yesterdayRevenue) / $yesterdayRevenue) * 100 
                : 0;

            $newUsers = User::whereDate('created_at', $today)->count();
            $yesterdayUsers = User::whereDate('created_at', $yesterday)->count();
            $userChangePercent = $yesterdayUsers > 0 
                ? (($newUsers - $yesterdayUsers) / $yesterdayUsers) * 100 
                : 0;

            $newProducts = MenuItem::whereDate('created_at', $today)->count();
            $yesterdayProducts = MenuItem::whereDate('created_at', $yesterday)->count();
            $productChangePercent = $yesterdayProducts > 0 
                ? (($newProducts - $yesterdayProducts) / $yesterdayProducts) * 100 
                : 0;

            // Tính giá trị đơn hàng trung bình
            $avgOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

            // Lấy 5 đơn hàng gần nhất
            $recentOrders = Order::with('user')
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($order) {
                    $products = collect($order->items)->map(function ($item) {
                        $menuItem = MenuItem::find($item['menu_id']);
                        return $menuItem ? $menuItem->name : 'Sản phẩm không tồn tại';
                    })->join(', ');

                    return [
                        'id' => $order->_id,
                        'customerName' => $order->user ? $order->user->name : 'Khách hàng',
                        'products' => $products,
                        'totalAmount' => $order->total_price,
                        'status' => $order->status,
                        'orderDate' => $order->created_at->format('Y-m-d H:i:s')
                    ];
                });

            return response()->json([
                'totalOrders' => $totalOrders,
                'totalRevenue' => $totalRevenue,
                'totalUsers' => $totalUsers,
                'totalProducts' => $totalProducts,
                'orderChangePercent' => round($orderChangePercent, 2),
                'revenueChangePercent' => round($revenueChangePercent, 2),
                'userChangePercent' => round($userChangePercent, 2),
                'productChangePercent' => round($productChangePercent, 2),
                'todayOrders' => $todayOrders,
                'todayRevenue' => $todayRevenue,
                'avgOrderValue' => round($avgOrderValue, 2),
                'newUsers' => $newUsers,
                'recentOrders' => $recentOrders
            ]);
        } catch (\Exception $e) {
            Log::error('Dashboard Error: ' . $e->getMessage());
            return response()->json(['message' => 'Có lỗi xảy ra khi tải dữ liệu thống kê'], 500);
        }
    }
}
