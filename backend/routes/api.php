<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{
    AuthController,
    CategoryController,
    MenuController,
    OrderController,
    InvoiceController,
    NotificationController,
    ReportController,
    RatingController,
    PromotionController,
    PaymentController,
    PosterController,
    CommentController,
    ImageController,
    UserController
};

// ======================
// Public APIs (No Auth)
// ======================
Route::get('/categories/random', [CategoryController::class, 'randomCategories']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);

Route::get('/menu', [MenuController::class, 'index']);
Route::get('/ratings', [RatingController::class, 'index']);

// ======================
// Auth APIs
// ======================
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:api')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });
});

// ======================
// Protected APIs (auth:api)
// ======================
Route::middleware('auth:api')->group(function () {

    // ---------- Category (Admin/Manager) ----------
    Route::middleware('role:admin,manager')->group(function () {
        Route::get('/categoriesadmin', [CategoryController::class, 'indexAdmin']);
        Route::get('/categoriesadmin/{id}', [CategoryController::class, 'adminShow']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
    });

    // ---------- Menu ----------
    // Public
    Route::get('/menu-items', [MenuController::class, 'index']);
    Route::get('/menu-items/{id}', [MenuController::class, 'show']);

    // Admin
    Route::prefix('admin')->group(function () {
        // User management
        Route::middleware('role:admin,manager')->group(function () {
            Route::get('/users', [UserController::class, 'index']);
            Route::get('/users/{id}', [UserController::class, 'show']);
            Route::post('/users', [UserController::class, 'store']);
            Route::put('/users/{id}', [UserController::class, 'update']);
            Route::delete('/users/{id}', [UserController::class, 'destroy']);
            Route::put('/users/{id}/status', [UserController::class, 'updateStatus']);
            Route::put('/users/{id}/role', [UserController::class, 'updateRole']);
        });

        // Menu Items
        Route::get('/menu-items', [MenuController::class, 'adminIndex']);
        Route::get('/menu-items/{id}', [MenuController::class, 'adminShow']);
        Route::post('/menu-items', [MenuController::class, 'adminStore']);
        Route::put('/menu-items/{id}', [MenuController::class, 'adminUpdate']);
        Route::delete('/menu-items/{id}', [MenuController::class, 'adminDestroy']);
    });

    // ---------- Orders ----------
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::put('/orders/{id}', [OrderController::class, 'update'])->middleware('role:admin');

    // ---------- Invoices ----------
    Route::get('/invoices', [InvoiceController::class, 'index']);
    Route::post('/invoices', [InvoiceController::class, 'store']);
    Route::get('/invoices/{id}', [InvoiceController::class, 'show']);
    Route::put('/invoices/{id}', [InvoiceController::class, 'update'])->middleware('role:admin');

    // ---------- Notifications ----------
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store'])->middleware('role:admin');
    Route::put('/notifications/{id}', [NotificationController::class, 'update']);

    // ---------- Reports (Admin Only) ----------
    Route::middleware('role:admin')->group(function () {
        Route::get('/reports', [ReportController::class, 'index']);
        Route::post('/reports', [ReportController::class, 'store']);
        Route::get('/reports/{id}', [ReportController::class, 'show']);
    });

    // ---------- Ratings ----------
    Route::post('/ratings', [RatingController::class, 'store']);
    Route::get('/ratings/{id}', [RatingController::class, 'show']);

    // ---------- Promotions ----------
    Route::get('/promotions', [PromotionController::class, 'index']);
    Route::get('/promotions/{id}', [PromotionController::class, 'show']);
    Route::middleware('role:admin')->group(function () {
        Route::post('/promotions', [PromotionController::class, 'store']);
        Route::put('/promotions/{id}', [PromotionController::class, 'update']);
        Route::delete('/promotions/{id}', [PromotionController::class, 'destroy']);
    });

    // ---------- Payments ----------
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::post('/payments', [PaymentController::class, 'store']);
    Route::get('/payments/{id}', [PaymentController::class, 'show']);
    Route::put('/payments/{id}', [PaymentController::class, 'update'])->middleware('role:admin');

    // ---------- Comments ----------
    Route::get('/comments', [CommentController::class, 'index']);
    Route::get('/comments/{id}', [CommentController::class, 'show']);
    Route::post('/comments', [CommentController::class, 'store']);
    Route::put('/comments/{id}', [CommentController::class, 'update']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

    // ---------- Image ----------
    Route::delete('/images', [ImageController::class, 'deleteImage'])->middleware('role:admin');

    // ---------- Posters ----------
    Route::get('/posters', [PosterController::class, 'index']);
    Route::get('/posters/{id}', [PosterController::class, 'show']);
    Route::middleware('role:admin')->group(function () {
        Route::post('/posters', [PosterController::class, 'store']);
        Route::put('/posters/{id}', [PosterController::class, 'update']);
        Route::delete('/posters/{id}', [PosterController::class, 'destroy']);
    });
});
