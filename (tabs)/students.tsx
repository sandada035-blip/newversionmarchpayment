import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';

export default function StudentsScreen() {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  const API_URL = 'https://script.google.com/macros/s/AKfycbzbPNczxmRTMd-_Jok0fVAqps_WQdFfrM1Ke-l-3qNEY_WILILzezLfqk1Gv2vSruDBng/exec';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      
      if (Array.isArray(json)) {
        setData(json);
        setFilteredData(json);
      } else {
        console.error("Error: ", json);
      }
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching student data:", error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSearch = (text: any) => {
    setSearchText(text);
    if (text) {
      const newData = data.filter((item: any) => {
        const itemData = item['ឈ្មោះសិស្ស'] ? item['ឈ្មោះសិស្ស'].toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
    } else {
      setFilteredData(data);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconContainer}>
            <Text style={styles.icon}>{item['ភេទ'] === 'Female' ? '👧' : '👦'}</Text>
        </View>
        <View style={{flex: 1}}>
            <Text style={styles.studentName}>{item['ឈ្មោះសិស្ស']}</Text>
            <Text style={styles.subText}>ថ្នាក់ទី: {item['ថ្នាក់']}</Text>
        </View>
        
        <View style={styles.feeBadge}>
            <Text style={styles.feeText}>{item['តម្លៃសិក្សា']}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>គ្រូបង្រៀន:</Text>
        <Text style={styles.value}>{item['ឈ្មោះគ្រូ']}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>ភេទ:</Text>
        <Text style={[styles.value, { color: item['ភេទ'] === 'Female' ? '#E91E63' : '#1976D2' }]}>
            {item['ភេទ']}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>បញ្ជីឈ្មោះសិស្ស 🎓</Text>
        <Text style={{color: 'gray', fontSize: 12}}>សិស្សសរុប: {data.length} នាក់</Text>
      </View>

      {/* 👇 ទីនេះជាកន្លែងដាក់ប្រអប់ស្វែងរកពិតប្រាកដ */}
      <View style={{ paddingHorizontal: 20 }}>
        <TextInput 
          style={styles.searchInput}
          placeholder="🔍 ស្វែងរកឈ្មោះសិស្ស..."
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={{marginTop: 10, color: 'gray'}}>កំពុងទាញទិន្នន័យសិស្ស...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData} 
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </SafeAreaView>
  );
}

// 👇 Style ទាំងអស់ត្រូវនៅខាងក្រោមគេនេះ
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { padding: 20, paddingTop: 50, backgroundColor: 'white', paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#2E7D32' },
  
  // 👉 នេះជា Style ថ្មីរបស់ប្រអប់ស្វែងរក ដែលធំនិងស្អាត
  searchInput: {
    backgroundColor: 'white',
    paddingVertical: 15,       // ធ្វើឱ្យប្រអប់មានកម្ពស់ខ្ពស់ជាងមុន (ធំ)
    paddingHorizontal: 20,     // គម្លាតអក្សរពីគែមឆ្វេងស្តាំ
    borderRadius: 25,          // ធ្វើឱ្យកោងមូលស្អាត
    fontSize: 16,              // ទំហំអក្សរពេលវាយឱ្យធំជាងមុន
    borderWidth: 1,
    borderColor: '#E3F2FD',
    marginTop: 15,
    marginBottom: 5,
    elevation: 3,              // បន្ថែមស្រមោលបន្តិចឱ្យមើលទៅផុស
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  card: { backgroundColor: 'white', borderRadius: 16, padding: 15, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, marginHorizontal: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  iconContainer: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  icon: { fontSize: 22 },
  studentName: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  subText: { fontSize: 12, color: 'gray' },
  
  feeBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: '#C8E6C9' },
  feeText: { fontWeight: 'bold', color: '#2E7D32', fontSize: 12 },
  
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  label: { color: 'gray', fontSize: 13 },
  value: { fontWeight: '600', fontSize: 13, color: '#333' }
});