<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CompanyController extends Controller
{
    public function register(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string',
            'country' => 'required|string',
            'activity' => 'required|string',
            'city' => 'required|string',
            'nif'=>'required|string'
        ]);

        $company = [
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'country' => [
                'name'=>$request->country,
                'code'=>''
            ],
            'activity' => [
                'name'=>$request->activity,
                'code'=>''
            ],
            'city' => $request->city,
            'nif'=>$request->nif
        ];
        $data = [
            'company'=> $company,
            'user'=> [
                'name'=> $request->name,
                'email'=> $request->email,
                'imagem'=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAwAAAAMACAMAAACkX/C8AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAC+lBMVEUAAABgYGBVVV5TWV5SWl5UWl1VWl1VWV5UWlxVWV5UWF5UWV1TWF1VWF4AAABYWFhSW19UWlxVWV1TWF1UWV1UWV1UWl1UWV1VWl1UWV5UWFxOYmJUWV5UWVxVWV1UWV1UWV1UWV1UWl1VWV6AgIBXV15UWl1UWF1UWV1UWV1VWV1UWFxNTWZVWV5VWlxUWV1UWV1UWV1VWV1UWl5TWl5ZWVlUWV1UWV1UWV1UWl1TWVxRXV1VVVVVWl9VWFxUWV1UWV1mZmZVVWFTWl1UWV1VXV1UWV1UWV1UWV1VWV5YWGBSW1tXV19UWV1TWF1SXFxUWV1AQEBUWV1UWV1TWlpUWV1VVVVbW1tUWV1UWV1VVWNUWV5UWV1SV1xUWF1TWl1UWV1VWVxVWV1UWV1VWV1SW1tVWV1TWF1UWF1dXV1UWV1UWl1UWlxUWV1TWF1VWF5UWFxVVWBTWl1UWV1UWV1UWV1UWV1UWV1TWF5RV1xYWGFUWV1VWF5UWF1UWF1VWl5UWV1UWVxVWF1VWVxUV19UWF1JSW1UWV5ZWVlUWV1TWlpUWV1UWl1VWF5UWV5VWlxUWl5TWF5UWVxUWV5TWl1UWVxTWF1UWV1UWV1UWV1TWVxUWV1UWV5TWV1VVVVTWV1UWl5TWWBVVVVUWV1UWV1UWV1RXl5UWVxVXFxSWl9TWV1VWmBUWl1UWlxUW15UWV1UWV1UWV1TWV1VWFxUWV1UWV5UWV1UWVxaWlpQYGBTWF1UWVxVWV1TWVxUWV5TWV5UWFtUWF5VWl1UWV1VWV1UWV1VW1tVWl1UWV5TWVxTWF1UWl5UWVxTWV1TWV1SV1tVWFxVWV1UWV1UWV5UWl1UWl5UWV1TWF5TWV9UWFxTWF1VVVVUWV5VWV1UWV1TWVxUWlxTWl1TWV1UWFxUWlxTWVxUWl1VWlxVXFxXV11VWF1UV15SWlpVVV5VWV1VW1tUWV1TWV1TWV1VWVxVWF5RV11TWV5UWFxVWV1TWF5UWV5UWVxUWV3///9xLu+1AAAA/HRSTlMACBsuQVVmcnd4iI+ZVAEaO1t7nLfO4fTN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",
                'password'=> '123456',
                'password1'=> '123456',
                'phone'=> $request->phone
            ],
            'license'=> [
                [
                    "id"=> 2,
                    "label"=> "configuracoes",
                    "value"=> "configuracoes",
                    "price"=> 1500,
                    "image"=> "config.png",
                    "created_at"=> null,
                    "updated_at"=> null
                ],


                [
                    "id"=> 5,
                    "label"=> "ponto de venda",
                    "value"=> "ponto de venda",
                    "price"=> 1500,
                    "image"=> "point-of-sale.png",
                    "created_at"=> null,
                    "updated_at"=> null
                ],

                [
                    "id" => 1,
                    "label"=> "faturacao",
                    "value"=> "faturacao",
                    "price"=> 1500,
                    "image"=> "faturation.png",
                    "created_at"=> null,
                    "updated_at"=> null
                ],

                [
                    "id"=> 6,
                    "label"=> "Stock",
                    "value"=> "Stock",
                    "price"=> 1500,
                    "image"=> "stock.png",
                    "created_at"=> null,
                    "updated_at"=> null
                ],


                [
                    "id"=> 4,
                    "label"=> "compra",
                    "value"=> "compra",
                    "price"=> 1500,
                    "image"=> "purchur.jpg",
                    "created_at"=> null,
                    "updated_at"=> null
                ],

                [
                    "id"=> 3,
                    "label"=> "funcionarios",
                    "value"=> "funcionarios",
                    "price"=> 1500,
                    "image"=> "funcionarios.png",
                    "created_at"=> null,
                    "updated_at"=> null
                ]
            ],
            'totals'=>$this->checkType($request->id)
        ];

        return $this->saveCompany($data);
    }

    function checkType($type) {
        $result = [];
        if($type == 1 ){
            $result = [
                "discount"=> 765,
                "total"=> 36720,
                "percent"=> 15,
                "month"=> 6
            ];
        }else if($type == 2){
            $result = [
                "discount"=> 1530,
                "total"=> 42840,
                "percent"=> 15,
                "month"=> 12
            ];
        }else{
            $result = [
                "discount"=> 0,
                "total"=> 0,
                "percent"=> 0,
                "month"=> 1
            ];
        }
        return $result;
    }

    function saveCompany($data) {
        $url = 'http://sisgesc.com/saveCompany/en';

        $response = Http::accept('application/json')->post($url, $data);
        return $response->body();
        if ($response->successful()) {
            // Ação para resposta bem-sucedida
            return $response->json();
        } elseif ($response->clientError()) {
            // Erro do lado do cliente (status 400-499)
            $errorDetails = $response->json(); // Assume que o erro vem em formato JSON
            return response()->json([
                'error' => 'Erro do lado do cliente ao enviar dados para o servidor.',
                'details' => $errorDetails
            ], $response->status());
        } elseif ($response->serverError()) {
            // Erro do lado do servidor (status 500-599)
            return response()->json([
                'error' => 'Erro do lado do servidor ao processar os dados.',
                'status' => $response->status()
            ], $response->status());
        } else {
            // Outros tipos de erros (por exemplo, problemas de rede ou timeout)
            return response()->json([
                'error' => 'Falha ao se comunicar com o servidor.',
                'status' => $response->status()
            ], $response->status());
        }
    }
}
