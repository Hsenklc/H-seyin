using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace sirlama_algoritmaları
{
    public partial class Form1: Form
    {
        public Form1()
        {
            InitializeComponent();
        }



        private void button1_Click(object sender, EventArgs e)
        {
            listBox1.Items.Add(textBox1.Text);
        }

        int[] datas;
        private void button2_Click(object sender, EventArgs e)
        {
            datas = new int[listBox1.Items.Count];

            for (int i = 0; i < listBox1.Items.Count; i++)
            {
                datas[i] = Convert.ToInt32(listBox1.Items[i]);
            }

            MessageBox.Show("veriler Dizeye aktarıldı");
        }

        int[] selectionshort(int[] numbers)
        {
            for (int i = 0; i < numbers.Length; i++)
            {
                int min = i;
                for (int j = i + 1; j < numbers.Length; j++)
                {
                    if (numbers[j] < numbers[min])
                    {
                        min = j;
                    }
                }

                int temp = numbers[i];
                numbers[i] = numbers[min];
                numbers[min] = temp;
            }

            return numbers;
        }

        private void button3_Click(object sender, EventArgs e)
        {
            int[] listed = selectionshort(datas);
            foreach (var item in listed)
            {
                listBox2.Items.Add(item);
            }
        }
    }
}
