using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ListBoxControl1
{
    public partial class Form1: Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e) //"Listeye Ekle" Butonu
        {
            listBox1.Items.Add(textBox1.Text); //Girilen değerleri listeye ekliyoruz.
        }

        private void button2_Click(object sender, EventArgs e) //"Listeyiyi Sil" Butonu
        {
            listBox1.Items.Clear(); //Listede ki elemanları temizliyoruz
        }

        private void button3_Click(object sender, EventArgs e) //İki liste arasında ki elemanları aktarma butonu
        {
            if (listBox2.Items.Count == 0) //İkinci liste boşu diye kontrol ediyoruz
            {
                for (int i = 0; i < listBox1.Items.Count; i++)  //Listede ki elemanların sayısı kadar bir döngü oluşturuyoruz
                {
                    listBox2.Items.Add(listBox1.Items[i]); //listede ki elemanları teker teker ikinci listeye aktarıyoruz.
                }
                listBox1.Items.Clear(); //Listeyi Temizliyoruz.
            }
            else
            {
                for (int i = 0; i < listBox2.Items.Count; i++) // İkinci Listede ki elemanların sayısı kadar bir döngü oluşturuyoruz
                {
                    listBox1.Items.Add(listBox2.Items[i]); //İkinci listede ki elemanları teker teker ikinci listeye aktarıyoruz.
                }
                listBox2.Items.Clear(); //İkinci Listeyi Temizliyoruz.
            }
        }
    }
}
