using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Service.Helper
{
    public static class SampleCodeHelper
    {
        public static string Generate()
        {
            var ms = DateTime.UtcNow.ToString("fff")[..3]; // Lấy 3 số mili giây
            var rand = new Random().Next(0, 100);           // Random 2 chữ số
            return $"SMP-{ms}{rand:D2}";
        }
    }
}
