using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.DTOs.Common
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }        // Thành công hay thất bại
        public T? Data { get; set; }             // Dữ liệu trả về (nếu có)
        public string Message { get; set; }      // Thông điệp kèm theo
        public int StatusCode { get; set; }      // Mã trạng thái HTTP

        public ApiResponse(T? data, string message = "", int statusCode = 200)
        {
            Success = true;
            Data = data;
            Message = message;
            StatusCode = statusCode;
        }

        public ApiResponse(string message, int statusCode)
        {
            Success = false;
            Data = default;
            Message = message;
            StatusCode = statusCode;
        }
        public static ApiResponse<T> SuccessResponse(T data, string message = "", int statusCode = 200)
            => new(data, message, statusCode);
            
        public static ApiResponse<T> FailResponse(string message, int statusCode)
            => new(message, statusCode);
    }
}
