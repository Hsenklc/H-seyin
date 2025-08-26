namespace hesapmakinesi
{
    public partial class MainPage : ContentPage
    {
        int count = 0;

        public MainPage()
        {
            InitializeComponent();
        }

        // Toplama işlemi
        private void OnAddClicked(object sender, EventArgs e)
        {
            double num1 = double.Parse(firstNumberEntry.Text);
            double num2 = double.Parse(secondNumberEntry.Text);

            double result = num1 + num2;

            resultLabel.Text = $"Sonuç: {result}";
        }

        // Çıkarma işlemi
        private void OnSubtractClicked(object sender, EventArgs e)
        {
            double num1 = double.Parse(firstNumberEntry.Text);
            double num2 = double.Parse(secondNumberEntry.Text);

            double result = num1 - num2;

            resultLabel.Text = $"Sonuç: {result}";
        }

        // Çarpma işlemi
        private void OnMultiplyClicked(object sender, EventArgs e)
        {
            double num1 = double.Parse(firstNumberEntry.Text);
            double num2 = double.Parse(secondNumberEntry.Text);

            double result = num1 * num2;

            resultLabel.Text = $"Sonuç: {result}";
        }

        // Bölme işlemi
        private void OnDivideClicked(object sender, EventArgs e)
        {
            double num1 = double.Parse(firstNumberEntry.Text);
            double num2 = double.Parse(secondNumberEntry.Text);

            if (num2 != 0) // Bölme işleminde sıfıra bölme hatasını engelle
            {
                double result = num1 / num2;
                resultLabel.Text = $"Sonuç: {result}";
            }
            else
            {
                resultLabel.Text = "Hata: Sıfıra bölünemez!";
            }
        }
    }
}