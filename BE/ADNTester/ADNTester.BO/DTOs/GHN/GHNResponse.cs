using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ADNTester.BO.DTOs.GHN
{
    public class GHNResponse
    {
        #region Fee
        public class GhnFeeResponse
        {
            [JsonPropertyName("code")]
            public int Code { get; set; }

            [JsonPropertyName("message")]
            public string Message { get; set; }

            [JsonPropertyName("data")]
            public GhnFeeData? Data { get; set; }
        }

        public class GhnFeeData
        {
            [JsonPropertyName("total")]
            public decimal Total { get; set; }

            [JsonPropertyName("service_fee")]
            public decimal ServiceFee { get; set; }

            [JsonPropertyName("insurance_fee")]
            public decimal InsuranceFee { get; set; }

            [JsonPropertyName("pick_station_fee")]
            public decimal PickStationFee { get; set; }

            [JsonPropertyName("coupon_value")]
            public decimal CouponValue { get; set; }

            [JsonPropertyName("r2s_fee")]
            public decimal R2sFee { get; set; }

            [JsonPropertyName("document_return")]
            public decimal DocumentReturn { get; set; }

            [JsonPropertyName("double_check")]
            public decimal DoubleCheck { get; set; }

            [JsonPropertyName("cod_fee")]
            public decimal CodFee { get; set; }

            [JsonPropertyName("pick_remote_areas_fee")]
            public decimal PickRemoteAreasFee { get; set; }

            [JsonPropertyName("deliver_remote_areas_fee")]
            public decimal DeliverRemoteAreasFee { get; set; }

            [JsonPropertyName("cod_failed_fee")]
            public decimal CodFailedFee { get; set; }
        }
        #endregion
        #region Service
        public class GhnServiceResponse
        {
            public List<GhnService>? data { get; set; }
        }

        public class GhnService
        {
            public int service_id { get; set; }
            public string short_name { get; set; } = string.Empty;
            public int service_type_id { get; set; }
        }
        #endregion
        #region Lead Time
        public class GhnLeadTimeResponse
        {
            [JsonPropertyName("code")]
            public int Code { get; set; }
            [JsonPropertyName("message")]
            public string Message { get; set; }
            [JsonPropertyName("data")]
            public GhnLeadTimeData Data { get; set; }
        }

        public class GhnLeadTimeData
        {
            [JsonPropertyName("leadtime")]
            public long Leadtime { get; set; }
            [JsonPropertyName("leadtime_order")]
            public GhnLeadTimeOrder LeadtimeOrder { get; set; }
            public DateTime LeadtimeAsDateTime
            {
                get
                {
                    return DateTimeOffset.FromUnixTimeSeconds(Leadtime).DateTime;
                }
            }
        }

        public class GhnLeadTimeOrder
        {
            [JsonPropertyName("from_estimate_date")]
            public DateTime FromEstimateDate { get; set; }
            [JsonPropertyName("to_estimate_date")]
            public DateTime ToEstimateDate { get; set; }
        }
        #endregion
        #region Order
        public class GhnCreateOrderResponse
        {
            [JsonPropertyName("code")]
            public int Code { get; set; }

            [JsonPropertyName("message")]
            public string Message { get; set; } = string.Empty;

            [JsonPropertyName("data")]
            public GhnCreateOrderData? Data { get; set; }
        }

        public class GhnCreateOrderData
        {
            [JsonPropertyName("district_encode")]
            public string? DistrictEncode { get; set; }

            [JsonPropertyName("expected_delivery_time")]
            public DateTime? ExpectedDeliveryTime { get; set; }

            [JsonPropertyName("fee")]
            public GhnFeeBreakdown? Fee { get; set; }

            [JsonPropertyName("order_code")]
            public string OrderCode { get; set; } = string.Empty;

            [JsonPropertyName("sort_code")]
            public string? SortCode { get; set; }

            [JsonPropertyName("total_fee")]
            public decimal TotalFee { get; set; }

            [JsonPropertyName("trans_type")]
            public string TransType { get; set; } = string.Empty;

            [JsonPropertyName("ward_encode")]
            public string? WardEncode { get; set; }
        }
        public class GhnFeeBreakdown
        {
            [JsonPropertyName("coupon")]
            public decimal Coupon { get; set; }

            [JsonPropertyName("insurance")]
            public decimal Insurance { get; set; }

            [JsonPropertyName("main_service")]
            public decimal MainService { get; set; }

            [JsonPropertyName("r2s")]
            public decimal R2s { get; set; }

            [JsonPropertyName("return")]
            public decimal Return { get; set; }

            [JsonPropertyName("station_do")]
            public decimal StationDo { get; set; }

            [JsonPropertyName("station_pu")]
            public decimal StationPu { get; set; }
        }

        #endregion




    }
}

