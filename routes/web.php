<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::view("/", 'welcome');
Route::get("/exitRequests/{hash}", 'ViewController@exitRequests');

Route::view("/dashboard", 'dashboard');
Route::view("/dashboard/clinic", 'clinic');
Route::view("/dashboard/clinic/localizations", 'clinicLocalizacion');
Route::view("/dashboard/visits", 'visits');
Route::view("/dashboard/sospechosos", 'sospechosos');
Route::view("/dashboard/momios", 'momios');

Route::view("/dashboard/clinic/administration", 'clinic_tests_update');
Route::view("/dashboard/clinic/edit", 'clinic_tests_capture');
Route::view("/dashboard/manageUsers", 'manageUsers');
Route::view("/dashboard/manageUsers/updateUser", 'updateUser');
Route::view("/dashboard/lightAlert", 'lightAlert');
Route::get("/dashboard/password/{hash}", 'ViewController@setPassword');

