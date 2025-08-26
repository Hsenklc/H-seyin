using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace siniflar
{
    class matematik
    {
        public matematik() //Kurucu Fonksiyon
        {
            MessageBox.Show("Sınıf Yüklendi");
        }

        ~matematik() //Yıkıcı Fonksiyon
        {
            MessageBox.Show("Sınıf Slindi");
        }

        public double ustAl(double alt, double ust)
        {
            double snc = 1;
            for (int i = 0; i< ust; i++)
            {
                snc *= alt;
            }
            return snc;
        }

        public int MaxBul(int[] dizi) //Bir dizinin içerisinde ki en büyük sayıyı bulmak
        {
            int max = dizi[0];
            for (int i = 1; i < dizi.Length; i++)
            {
                if (dizi[i] > max)
                {
                    max = dizi[i];
                }
            }
            return max;
        }

        public int MinBul(int[] dizi) //Bir dizinin içerisinde ki en küçük sayıyı bulmak
        {
            int min = dizi[0];
            for (int i = 1; i < dizi.Length; i++)
            {
                if (dizi[i] < min)
                {
                    min = dizi[i];
                }
            }
            return min;
        }

        public bool siralama(int[] dizi) //Dizi sıraladıysa true, sıralamadıysa false yazacak
        {
            for (int i = 0; i < dizi.Length - 1; i++)
            {
                if (dizi[i] > dizi[i + 1])
                {
                    return false;
                }
            }
            return true;
        }
    }
}
