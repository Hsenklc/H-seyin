namespace hardwareControl
{
    public partial class MainPage : ContentPage
    {

        public MainPage()
        {
            InitializeComponent();
        }

        private void btn1_Clicked(object sender, EventArgs e)
        {
            //TimeSpan titresimSuresi = TimeSpan.FromSeconds(10);
            //Vibration.Default.Vibrate(titresimSuresi);

            int randomSure = Random.Shared.Next(1, 20);
            Vibration.Default.Vibrate(randomSure);
        }

        private void btn2_Clicked(object sender, EventArgs e)
        {
            Vibration.Default.Cancel();
        }

        private async void btn3_Clicked(object sender, EventArgs e)
        {
            await Flashlight.Default.TurnOnAsync();
        }

        private async void btn4_Clicked(object sender, EventArgs e)
        {
            await Flashlight.Default.TurnOffAsync();
        }

        private void btn5_Clicked(object sender, EventArgs e)
        {
            btn5.Text = "%" + (Battery.Default.ChargeLevel * 100).ToString();
        }

        private void btn6_Clicked(object sender, EventArgs e)
        {
            txtozellik.Text = "Model: " + DeviceInfo.Current.Model + "\n"
                + "Üretici Firma: " + DeviceInfo.Current.Manufacturer + "\n"
                + "Adı: " + DeviceInfo.Current.Name + "\n"
                + "OS versiyon: " + DeviceInfo.Current.VersionString + "\n"
                + "Platform: " + DeviceInfo.Current.Platform + "\n"
                + "IDIOM: " + DeviceInfo.Current.Idiom;
        }
    }
}
