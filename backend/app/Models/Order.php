<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Order extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'orders';

    protected $fillable = [
        'user_id', 'items', 'total_price', 'status', 'delivery_status', 'order_time', 'note',
    ];

    protected $dates = ['order_time', 'created_at', 'updated_at'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', '_id');
    }

    public function invoice()
    {
        return $this->hasOne(Invoice::class, 'order_id', '_id');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class, 'order_id', '_id');
    }
}