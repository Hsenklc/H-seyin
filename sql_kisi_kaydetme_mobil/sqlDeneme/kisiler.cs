using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SQLite;

namespace sqlDeneme
{
    public class kisiler
    {
        [PrimaryKey, AutoIncrement]
        public int ID { get; set; }
        public string Ad { get; set; }
        public string Soyad { get; set; }
        public double Telefonno { get; set; }
    }
}
