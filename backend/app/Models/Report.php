<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Report extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'reports';

    protected $fillable = [
        'type', 'period', 'custom_period', 'data', 'generated_at',
    ];

    protected $dates = ['generated_at', 'created_at', 'updated_at'];
}