using SQLite;

namespace vize_exam;

public partial class login_page : TabbedPage
{
	public login_page()
	{
		InitializeComponent();


	}

    private string x;
    private string y;
    private string x2;
    private string y2;

    //public static string path = System.IO.Path.Combine(System.Environment.GetFolderPath(System.Environment.SpecialFolder.LocalApplicationData), "Rehber.db3");
    //public static bool SaveMe(Database data)
    //{
    //    try
    //    {
    //        using (var connection = new SQLiteConnection(path))
    //        {
    //            connection.Insert(data);
    //            return true;
    //        }
    //    }
    //    catch (Exception)
    //    {
    //        return false;
    //    }
    //}

    private void Button_Clicked_1(object sender, EventArgs e)
    {
        x = Convert.ToString(txtusername.Text);
        y = Convert.ToString(txtpassword.Text);

        DisplayAlert("Succesfull ", "Your registration is complete", "Ok");
    
    }

    private void Button_Clicked_2(object sender, EventArgs e)
    {
        x2 = Convert.ToString(txtusername2.Text);
        y2 = Convert.ToString(txtpassword2.Text);

        if (x == x2 && y == y2)
        {
            Navigation.PushAsync(new hardware_page());
        }
        else
        {
            DisplayAlert("Unsuccessful", "Ýnformation is incorrect", "Ok");
        }
    }
}