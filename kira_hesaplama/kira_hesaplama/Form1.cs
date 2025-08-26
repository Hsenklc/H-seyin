using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace kira_hesaplama
{
    public partial class Form1: Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            //Değişkenleri tanımlıyoruz
            double kira;
            double oran;
            double yil;
            double snc = 1;

            kira = Convert.ToDouble(textBox1.Text); //Girilen kira değerini "kira" adlı değişkene atıyoruz.
            oran = Convert.ToDouble(textBox2.Text); //Girilen oran değerini "oran" adlı değişkene atıyoruz.
            yil = Convert.ToDouble(textBox3.Text); //Girilen yıl değerini "yıl" adlı değişkene atıyoruz.

            for (int i = 0; i < yil; i++) //bir döngü oluşturuyoruz
            {
                snc = snc * (1 + oran / 100); //sonucu bulmak için matematiksel bir işlem yapıyoruz.
            }

            MessageBox.Show(snc.ToString()); //sonucu ekrana mesaj kutusu ile yazdırıyoruz.
        }
    }
}
