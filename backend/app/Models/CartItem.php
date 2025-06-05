<?php
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class CartItem extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'cart_items';

    protected $fillable = [
        'user_id',
        'menu_id',
        'quantity',
        'note',
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id', '_id');
    }

    public function menuItem() {
        return $this->belongsTo(MenuItem::class, 'menu_id', '_id');
    }
}
