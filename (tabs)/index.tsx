
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Alert, Linking, RefreshControl, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pin, setPin] = useState('');
  
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 👇👇👇 ដាក់ Link វែងៗរបស់ Boss នៅកន្លែងនេះ
  const API_URL = 'https://script.google.com/macros/s/AKfycbzbPNczxmRTMd-_Jok0fVAqps_WQdFfrM1Ke-l-3qNEY_WILILzezLfqk1Gv2vSruDBng/exec';

  // មុខងារ Login
  const handleLogin = () => {
    if (pin === '1234') { 
      setIsLoggedIn(true);
    } else {
      Alert.alert('ខុសកូដ!', 'សូមព្យាយាមម្តងទៀត។');
      setPin('');
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      setData(json);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // មុខងារគណនាលេខសរុប
  const calculateTotal = () => {
    let totalStudents = 0;
    let totalIncome = 0;
    let totalTeacherCount = 0;
    let totalFemale = 0;
    let totalTeacherShare = 0; 
    let totalSchoolShare = 0;  
    
    data.forEach((item: any) => {
      totalStudents += item['ចំនួនសិស្ស'] || 0;
      let incomeStr = item['ថវិកាប្រមូលបាន'] || "0";
      let incomeVal = parseInt(incomeStr.toString().replace(/[^0-9]/g, ''));
      totalIncome += incomeVal;
      totalTeacherCount++;
      if (item['ភេទ'] === 'Female') totalFemale++;
      
      let teacherMoneyStr = item['ថវិកាគ្រូ 80%'] || "0";
      let teacherMoneyVal = parseInt(teacherMoneyStr.toString().replace(/[^0-9]/g, '')); 
      totalTeacherShare += teacherMoneyVal;

      let schoolMoneyStr = item['ថវិកាសាលា20%'] || item['ថវិកាសាលា 20%'] || "0"; 
      let schoolMoneyVal = parseInt(schoolMoneyStr.toString().replace(/[^0-9]/g, ''));
      totalSchoolShare += schoolMoneyVal;
    });

    const formatMoney = (amount: number) => {
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KHR";
    };

    return {
      totalStudents: totalStudents,
      totalIncome: formatMoney(totalIncome),
      teacherCount: totalTeacherCount,
      femaleCount: totalFemale,
      teacherShare: formatMoney(totalTeacherShare),
      schoolShare: formatMoney(totalSchoolShare)
    };
  };

  const totals = calculateTotal();

  // 👇 ផ្នែក Login Screen
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.loginContainer}>
        <LinearGradient colors={['#1565C0', '#42A5F5']} style={styles.loginGradient}>
          <View style={styles.loginBox}>
            <View style={styles.loginIconBg}>
                <Ionicons name="shield-checkmark" size={40} color="#1565C0" />
            </View>
            <Text style={styles.loginTitle}> Akkmohessey App 🔒</Text>
            <Text style={styles.loginSubtitle}>សូមបញ្ចូលកូដសម្ងាត់ដើម្បីចូល</Text>
            
            <TextInput 
              style={styles.pinInput}
              placeholder="****"
              placeholderTextColor="#ccc"
              secureTextEntry
              keyboardType="numeric"
              maxLength={4}
              value={pin}
              onChangeText={setPin}
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>ចូលមើល (Login)</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // 👇 ផ្នែក Dashboard (Home)
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1565C0" />
      
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header ស្វាគមន៍ */}
        <View style={styles.topHeader}>
            <View>
                <Text style={styles.greetingText}>សួស្តី, លោកគ្រូ អ្នកគ្រូ! 👋</Text>
                <Text style={styles.dateText}>សូមពិនិត្យមើលរបាយការណ៍ថវិកា</Text>
            </View>
            <View style={styles.profileIcon}>
                <Ionicons name="person" size={20} color="#1565C0" />
            </View>
        </View>

        {/* Dashboard ធំ (Gradient) */}
        <LinearGradient colors={['#1565C0', '#0D47A1']} style={styles.dashboard}>
            <View style={styles.dashHeaderRow}>
                <Text style={styles.dashHeaderTitle}>ចំណូលសរុបខែនេះ 💰</Text>
            </View>
            <Text style={styles.bigTotal}>{totals.totalIncome}</Text>
            
            <View style={styles.divider} />

            <View style={styles.gridRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>សិស្សសរុប</Text>
                    <Text style={styles.statValue}>{totals.totalStudents} នាក់</Text>
                </View>
                <View style={styles.verticalLine} />
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>គ្រូសរុប</Text>
                    <Text style={styles.statValue}>{totals.teacherCount} នាក់</Text>
                </View>
            </View>
        </LinearGradient>

        {/* កាតលម្អិតបន្ថែម */}
        <Text style={styles.sectionTitle}>បែងចែកថវិកា 📊</Text>

        <View style={styles.rowCards}>
            {/* កាតគ្រូ 80% */}
            <View style={[styles.infoCard, { backgroundColor: '#E3F2FD' }]}>
                <View style={[styles.iconBox, { backgroundColor: '#BBDEFB' }]}>
                    <Ionicons name="people" size={24} color="#1976D2" />
                </View>
                <Text style={styles.cardLabel}>ចំណែកគ្រូ (80%)</Text>
                <Text style={[styles.cardValue, { color: '#1565C0' }]}>{totals.teacherShare}</Text>
            </View>

            {/* កាតសាលា 20% */}
            <View style={[styles.infoCard, { backgroundColor: '#FFF3E0' }]}>
                <View style={[styles.iconBox, { backgroundColor: '#FFE0B2' }]}>
                    <Ionicons name="business" size={24} color="#F57C00" />
                </View>
                <Text style={styles.cardLabel}>ចំណែកសាលា (20%)</Text>
                <Text style={[styles.cardValue, { color: '#E65100' }]}>{totals.schoolShare}</Text>
            </View>
        </View>

        {/* 👇 ផ្នែកទាក់ទងអ្នកបង្កើត (Contact Developer) */}
        <View style={styles.contactSection}>
            <View style={styles.contactHeader}>
                <Ionicons name="call" size={20} color="gray" />
                <Text style={styles.contactTitle}>ទាក់ទងអ្នកបង្កើត (Developer)</Text>
            </View>

            <View style={styles.contactRow}>
                {/* ប៊ូតុង Telegram */}
                <TouchableOpacity 
                    style={[styles.socialBtn, { backgroundColor: '#0088cc' }]}
                    onPress={() => Linking.openURL('https://t.me/MalindaHorm')} 
                >
                    <Ionicons name="paper-plane" size={20} color="white" />
                    <Text style={styles.socialBtnText}>Telegram</Text>
                </TouchableOpacity>

                {/* ប៊ូតុង Facebook */}
                <TouchableOpacity 
                    style={[styles.socialBtn, { backgroundColor: '#1877F2' }]}
                    onPress={() => Linking.openURL('https://www.facebook.com/hammalinda/')}
                >
                    <Ionicons name="logo-facebook" size={20} color="white" />
                    <Text style={styles.socialBtnText}>Facebook</Text>
                </TouchableOpacity>
            </View>

            {/* ប៊ូតុង Call */}
            <TouchableOpacity 
                style={styles.callBtn}
                onPress={() => Linking.openURL('tel:017751115')}
            >
                <Ionicons name="call" size={24} color="white" />
                <Text style={styles.callBtnText}>Call Me: 017 751 115</Text>
            </TouchableOpacity>
        </View>
        

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Login Styles
  loginContainer: { flex: 1 },
  loginGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loginBox: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 30, alignItems: 'center', elevation: 10 },
  loginIconBg: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  loginTitle: { fontSize: 24, fontWeight: 'bold', color: '#1565C0', marginBottom: 5 },
  loginSubtitle: { fontSize: 14, color: 'gray', marginBottom: 30 },
  pinInput: { width: '100%', backgroundColor: '#F5F5F5', padding: 15, borderRadius: 10, textAlign: 'center', fontSize: 24, letterSpacing: 10, marginBottom: 20, borderWidth: 1, borderColor: '#ddd' },
  loginButton: { width: '100%', backgroundColor: '#1565C0', padding: 15, borderRadius: 10, alignItems: 'center' },
  loginButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  // Home Styles
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40 },
  greetingText: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  dateText: { fontSize: 13, color: 'gray' },
  profileIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center' },

  dashboard: { margin: 20, padding: 25, borderRadius: 25, elevation: 5 },
  dashHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  dashHeaderTitle: { color: '#BBDEFB', fontSize: 14, fontWeight: 'bold' },
  bigTotal: { color: 'white', fontSize: 32, fontWeight: 'bold', marginBottom: 15 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 15 },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center', flex: 1 },
  statLabel: { color: '#E3F2FD', fontSize: 12 },
  statValue: { color: 'white', fontSize: 18, fontWeight: 'bold', marginTop: 5 },
  verticalLine: { width: 1, height: '100%', backgroundColor: 'rgba(255,255,255,0.2)' },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginLeft: 20, marginTop: 15, marginBottom: 10 },
  rowCards: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  infoCard: { width: '48%', padding: 15, borderRadius: 15, elevation: 2 },
  iconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  cardLabel: { fontSize: 12, color: 'gray', marginBottom: 5 },
  cardValue: { fontSize: 16, fontWeight: 'bold' },

  shortcutCard: { width: 100, height: 100, backgroundColor: 'white', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15, elevation: 2, marginBottom: 20 },
  shortcutText: { marginTop: 10, fontSize: 12, fontWeight: 'bold', color: '#555' },

  // 👇 Style ដែលខ្ញុំទើបតែបន្ថែមឱ្យសម្រាប់ផ្នែក Contact
  contactSection: {
    backgroundColor: '#1E1E1E', 
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  contactHeader: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  contactTitle: { fontSize: 16, fontWeight: 'bold', color: '#E0E0E0', marginLeft: 10 },
  contactRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  socialBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, borderRadius: 10, marginHorizontal: 5 },
  socialBtnText: { color: 'white', fontWeight: 'bold', fontSize: 15, marginLeft: 8 },
  callBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#4CAF50', paddingVertical: 15, borderRadius: 10, marginHorizontal: 5 },
  callBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 10 },
});