using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace buton_gizleme
{
    public partial class Form1: Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e) //Gösterme ve Gizleme Butonu
        {
            if (label1.Visible) //Yazı görülüyor mu diye kontrol ediyoruz
            {
                label1.Visible = false; // Eğer yazı görülüyorsa, onu gizliyoruz.
                button1.Text = "Göster"; //Butonun üzerinde ki yazıyı "Göster" olarak değiştiriyoruz
            }
            else
            {
                label1.Visible = true; //Eğer yazı gizliyse, onu gösteriyoruz.
                button1.Text = "Gizle"; //Butonun üzerinde ki yazıyı "Gizle" olarak değiştiriyoruz
            }
        }
    }
}
