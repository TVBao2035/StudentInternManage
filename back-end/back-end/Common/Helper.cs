using Microsoft.IdentityModel.Tokens;
using System;
using System.Globalization;

namespace back_end.Common
{
    public class Helper
    {
        public static DateTime FormatDate(DateTime date)
        {
            return DateTime.ParseExact(
                    date.ToShortDateString().ToString(),
                    "dd/MM/yyyy",
                    CultureInfo.InvariantCulture
                );
        
        }

        public static string FormatDate(string date)
        {
            return DateTime.ParseExact(date, "dd/MM/yyyy", CultureInfo.InvariantCulture).ToString("dd/MM/yyyy");
        }
    }
}
