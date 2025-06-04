<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\RatingController;
use App\Http\Controllers\Api\PromotionController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ImageController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

//các api không cần xác thực

    Route::get('/categories/random', [CategoryController::class, 'randomCategories']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    

    Route::get('/menu', [MenuController::class, 'index']);
    Route::get('/ratings', [RatingController::class, 'index']);

Route::group(['prefix' => 'auth'], function () {
    
    Route::post('/login', [AuthController::class, 'login']);
    Route::middleware('auth:api')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });
});

Route::middleware('auth:api')->group(function () {
// Categories
    //Admin-Manager

    Route::middleware('role:admin,manager')->group(function () {
        // User management routes
        Route::prefix('admin')->group(function () {
            Route::get('/users', [UserController::class, 'index']);
            Route::get('/users/{id}', [UserController::class, 'show']);
            Route::post('/users', [UserController::class, 'store']);
            Route::put('/users/{id}', [UserController::class, 'update']);
            Route::delete('/users/{id}', [UserController::class, 'destroy']);
            Route::put('/users/{id}/status', [UserController::class, 'updateStatus']);
            Route::put('/users/{id}/role', [UserController::class, 'updateRole']);
        });

        Route::get('/categoriesadmin', [CategoryController::class, 'indexAdmin']);
        Route::get('/categoriesadmin/{id}', [CategoryController::class, 'adminShow']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
    });
// Menu Items  
    // Public (user)
    Route::get('/menu-items', [MenuController::class, 'index']);
    Route::get('/menu-items/{id}', [MenuController::class, 'show']);
    // Admin-Manager
    Route::prefix('admin')->group(function () {
        Route::get('/menu-items', [MenuController::class, 'adminIndex']);
        Route::get('/menu-items/{id}', [MenuController::class, 'adminShow']);
        Route::post('/menu-items', [MenuController::class, 'adminStore']);
        Route::put('/menu-items/{id}', [MenuController::class, 'adminUpdate']);
        Route::delete('/menu-items/{id}', [MenuController::class, 'adminDestroy']);
    });
// users
    // Admin


    Route::get('/orders', [OrderController::class, 'index']); 
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::put('/orders/{id}', [OrderController::class, 'update'])->middleware('role:admin');

    Route::get('/invoices', [InvoiceController::class, 'index']);
    Route::post('/invoices', [InvoiceController::class, 'store']);
    Route::get('/invoices/{id}', [InvoiceController::class, 'show']);
    Route::put('/invoices/{id}', [InvoiceController::class, 'update'])->middleware('role:admin');

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store'])->middleware('role:admin');
    Route::put('/notifications/{id}', [NotificationController::class, 'update']);

    Route::get('/reports', [ReportController::class, 'index'])->middleware('role:admin');
    Route::post('/reports', [ReportController::class, 'store'])->middleware('role:admin');
    Route::get('/reports/{id}', [ReportController::class, 'show'])->middleware('role:admin');

    
    Route::post('/ratings', [RatingController::class, 'store']);
    Route::get('/ratings/{id}', [RatingController::class, 'show']);

    Route::get('/promotions', [PromotionController::class, 'index']);
    Route::post('/promotions', [PromotionController::class, 'store'])->middleware('role:admin');
    Route::get('/promotions/{id}', [PromotionController::class, 'show']);
    Route::put('/promotions/{id}', [PromotionController::class, 'update'])->middleware('role:admin');
    Route::delete('/promotions/{id}', [PromotionController::class, 'destroy'])->middleware('role:admin');

    Route::get('/payments', [PaymentController::class, 'index']);
    Route::post('/payments', [PaymentController::class, 'store']);
    Route::get('/payments/{id}', [PaymentController::class, 'show']);
    Route::put('/payments/{id}', [PaymentController::class, 'update'])->middleware('role:admin');

    // Thêm các route cho CommentController
    Route::get('/comments', [CommentController::class, 'index']);
    Route::get('/comments/{id}', [CommentController::class, 'show']);
    Route::post('/comments', [CommentController::class, 'store']);
    Route::put('/comments/{id}', [CommentController::class, 'update']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

    Route::delete('/images', [ImageController::class, 'deleteImage'])->middleware('role:admin');


});