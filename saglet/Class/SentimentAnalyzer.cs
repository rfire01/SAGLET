using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace SAGLET.Class
{
    public sealed class SentimentAnalyzer
    {
        static Dictionary<string, int> words;
        static readonly SentimentAnalyzer _instance = new SentimentAnalyzer();
        public static SentimentAnalyzer Instance
        {
            get { return _instance; }
        }

        private SentimentAnalyzer()
        {
            words = new Dictionary<string, int>();

            string path = Path.Combine(Environment.CurrentDirectory, @"App_Data\", "AFINN-Heb.txt");
            string[] lines = File.ReadAllLines(path);
            foreach (string line in lines)
            {
                string[] lineArr = line.Split(' ');
                string word = lineArr[0].Trim();
                int val = Convert.ToInt32(lineArr[1].Trim());
                words[word] = val;
            }
        }

        public static int GetSentiment(string sentence){
            int score = 5;
            string[] senWords = Regex.Split(sentence, @"\W+");
            foreach (string word in senWords){
		        int value;
                if (!words.TryGetValue(word, out value)) { score += value; }
	        }
            // normalize
            if (score > 10) score = 10;
            if (score < 0) score = 0;
            
            return score * 10;
        }
    }
}