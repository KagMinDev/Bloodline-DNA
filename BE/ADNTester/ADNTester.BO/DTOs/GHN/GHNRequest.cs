using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ADNTester.BO.DTOs.GHN
{
    public class GHNRequest
    {
        public class GhnShippingFeeRequest
        {
            public int FromDistrictId { get; set; }
            public int ToDistrictId { get; set; }
            public string FromWardCode { get; set; } = null!;
            public string ToWardCode { get; set; } = null!;
            public int ServiceId { get; set; }
            public int Weight { get; set; } = 1000;
            public int Height { get; set; } = 15;
            public int Length { get; set; } = 15;
            public int Width { get; set; } = 15;
        }
        public class GhnLeadTimeRequest
        {
            public int FromDistrictId { get; set; }
            public string FromWardCode { get; set; } = null!;
            public int ToDistrictId { get; set; }
            public string ToWardCode { get; set; } = null!;
            public int ServiceId { get; set; }
        }
        #region Order request
        public class GhnCreateOrderRequest
        {
            [JsonPropertyName("payment_type_id")]
            public int PaymentTypeId { get; set; } // int, e.g. 1 or 2

            [JsonPropertyName("note")]
            public string Note { get; set; } = string.Empty;

            [JsonPropertyName("required_note")]
            public string RequiredNote { get; set; } = string.Empty;

            [JsonPropertyName("from_name")]
            public string FromName { get; set; } = string.Empty;

            [JsonPropertyName("from_phone")]
            public string FromPhone { get; set; } = string.Empty;

            [JsonPropertyName("from_address")]
            public string FromAddress { get; set; } = string.Empty;

            [JsonPropertyName("from_ward_name")]
            public string FromWardName { get; set; } = string.Empty;

            [JsonPropertyName("from_district_name")]
            public string FromDistrictName { get; set; } = string.Empty;

            [JsonPropertyName("from_province_name")]
            public string FromProvinceName { get; set; } = string.Empty;

            [JsonPropertyName("return_phone")]
            public string ReturnPhone { get; set; } = string.Empty;

            [JsonPropertyName("return_address")]
            public string ReturnAddress { get; set; } = string.Empty;

            [JsonPropertyName("return_district_id")]
            public int? ReturnDistrictId { get; set; }

            [JsonPropertyName("return_ward_code")]
            public string ReturnWardCode { get; set; } = string.Empty;

            [JsonPropertyName("client_order_code")]
            public string ClientOrderCode { get; set; } = string.Empty;

            [JsonPropertyName("to_name")]
            public string ToName { get; set; } = string.Empty;

            [JsonPropertyName("to_phone")]
            public string ToPhone { get; set; } = string.Empty;

            [JsonPropertyName("to_address")]
            public string ToAddress { get; set; } = string.Empty;

            [JsonPropertyName("to_ward_code")]
            public string ToWardCode { get; set; } = string.Empty;

            [JsonPropertyName("to_district_id")]
            public int ToDistrictId { get; set; }

            [JsonPropertyName("cod_amount")]
            public int CodAmount { get; set; }

            [JsonPropertyName("content")]
            public string Content { get; set; } = string.Empty;

            [JsonPropertyName("weight")]
            public int Weight { get; set; }

            [JsonPropertyName("length")]
            public int Length { get; set; }

            [JsonPropertyName("width")]
            public int Width { get; set; }

            [JsonPropertyName("height")]
            public int Height { get; set; }

            [JsonPropertyName("pick_station_id")]
            public int? PickStationId { get; set; }

            [JsonPropertyName("deliver_station_id")]
            public int? DeliverStationId { get; set; }

            [JsonPropertyName("insurance_value")]
            public int InsuranceValue { get; set; }

            [JsonPropertyName("service_id")]
            public int ServiceId { get; set; }

            [JsonPropertyName("service_type_id")]
            public int ServiceTypeId { get; set; }

            [JsonPropertyName("coupon")]
            public string? Coupon { get; set; }

            [JsonPropertyName("pick_shift")]
            public List<int> PickShift { get; set; } = new();

            [JsonPropertyName("items")]
            public List<GhnItem> Items { get; set; } = new();
        }

        public class GhnItem
        {
            [JsonPropertyName("name")]
            public string Name { get; set; } = string.Empty;

            [JsonPropertyName("code")]
            public string Code { get; set; } = string.Empty;

            [JsonPropertyName("quantity")]
            public int Quantity { get; set; }

            [JsonPropertyName("price")]
            public int Price { get; set; }

            [JsonPropertyName("length")]
            public int Length { get; set; }

            [JsonPropertyName("width")]
            public int Width { get; set; }

            [JsonPropertyName("height")]
            public int Height { get; set; }

            [JsonPropertyName("weight")]
            public int Weight { get; set; }

            [JsonPropertyName("category")]
            public GhnItemCategory Category { get; set; } = new();
        }

        public class GhnItemCategory
        {
            [JsonPropertyName("level1")]
            public string Level1 { get; set; } = string.Empty;
        }
        #endregion

    }
}
