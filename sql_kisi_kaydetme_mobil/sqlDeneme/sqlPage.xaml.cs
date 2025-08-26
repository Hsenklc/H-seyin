using SQLite;

namespace sqlDeneme;

public partial class sqlPage : ContentPage
{
	public sqlPage()
	{
		InitializeComponent();
	}
	public static string path = System.IO.Path.Combine
		(System.Environment.GetFolderPath(System.Environment.SpecialFolder.LocalApplicationData),"Rehber.db3");

    private void btn1_Clicked(object sender, EventArgs e)
    {
		try
		{
			using (var connection = new SQLiteConnection(path))
			{
				connection.CreateTable<sqlDeneme.kisiler>();
			}
			DisplayAlert("Baþarýlý", "Veri Tabaný Baþarýlý Bir Þekilde Oluþturuldu...", "Ok");
		}
		catch (Exception)
		{
			DisplayAlert("Hata", "Veri Tabaný Oluþturulamadý", "Ok");
		}
    }

	public static bool Kaydet(kisiler kisi)
	{
		try
		{
			using (var connection = new SQLiteConnection(path))
			{
				connection.Insert(kisi);
				return true;
			}
		}
		catch (Exception)
		{
			return false;
		}
	}
    private void btn2_Clicked(object sender, EventArgs e)
    {
		kisiler birkisi = new kisiler();
		birkisi.Ad = txtAd.Text;
		birkisi.Soyad = txtSoyad.Text;
		birkisi.Telefonno =  Convert.ToDouble(txtTelefon.Text);

		if (Kaydet(birkisi))
		{
			DisplayAlert("Baþarýlý", "Veriler Kaydedildi ", "OK");
		}

		else
		{
			DisplayAlert("Uyarý", "Veriler Kaydedilmedi ", "Ok");
		}
    }

	public static List<kisiler> tumKisileriGetir()
	{
		try
		{
			using (var connection = new SQLiteConnection(path))
			{
				return connection.Table<kisiler>().ToList();
			}
		}
		catch (Exception)
		{
			return null;
		}
	}

    private void btn3_Clicked(object sender, EventArgs e)
    {
		List<kisiler> kisilerlistesi = tumKisileriGetir();
		List<string> rehberListesi = new List<string> { };

		for (int i=0; i< kisilerlistesi.Count; i++)
		{
			rehberListesi.Add(kisilerlistesi[i].ID.ToString() +
				" - " + kisilerlistesi[i].Ad.ToString() +
				" - " + kisilerlistesi[i].Soyad.ToString() +
				" - " + kisilerlistesi[i].Telefonno);
		}
		LstKisiler.ItemsSource = rehberListesi;
    }
}