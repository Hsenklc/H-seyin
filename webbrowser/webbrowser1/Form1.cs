using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace webbrowser1
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void menuStrip2_ItemClicked(object sender, ToolStripItemClickedEventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {
            webBrowser1.Navigate(textBox1.Text.Trim());
        }

        private void anasayfaToolStripMenuItem_Click(object sender, EventArgs e)
        {
            webBrowser1.Navigate("www.isparta.edu.tr");
        }

        private void webBrowser1_DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
        {
            textBox1.Text = webBrowser1.Url.ToString();
            this.Text = webBrowser1.DocumentTitle.ToString();
        }

        private void ileriToolStripMenuItem_Click(object sender, EventArgs e)
        {
            webBrowser1.GoForward();
        }

        private void geriToolStripMenuItem_Click(object sender, EventArgs e)
        {
            webBrowser1.GoBack();
        }

        private void yenileToolStripMenuItem_Click(object sender, EventArgs e)
        {
            webBrowser1.Refresh();
        }

        private void textBox1_TextChanged(object sender, EventArgs e)
        {
            
        }

        private void textBox1_KeyPress(object sender, KeyPressEventArgs e)
        {
            if(e.KeyChar == Convert.ToChar(Keys.Enter))
            {
                webBrowser1.Navigate(textBox1.Text);
            }
        }
    }
}
