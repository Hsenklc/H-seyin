using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace kimlik_kontrol
{
    public partial class Form1: Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        string kimlik;
        int karaktersayisi;
        int toplam = 0;
        string ikincirakam;
        string sonkarakter;

        private void button1_Click(object sender, EventArgs e)
        {
            kimlik = textBox1.Text;
            karaktersayisi = Convert.ToInt16(kimlik.Length);
            
            if (karaktersayisi != 11)
            {
                MessageBox.Show("Kimlik 11 haneli değil...");
            }
            else
            {

                for (int i = 0; i <= 9; i++)
                {
                    toplam = toplam + Convert.ToInt32(kimlik[i].ToString());
                }

                ikincirakam = Convert.ToString(Convert.ToString(toplam)[1]);
                sonkarakter = Convert.ToString(kimlik[10]);

                if (ikincirakam != sonkarakter)
                {
                    MessageBox.Show("Kimlik numaranız yanlış...");
                }
                else
                {
                    MessageBox.Show("Kimlik numaranız doğru...");
                }
            }
            
        }
    }
}
