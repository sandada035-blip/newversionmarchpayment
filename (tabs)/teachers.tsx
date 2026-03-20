import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, RefreshControl, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TeachersScreen() {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  // 👇 State សម្រាប់ Modal បណ្ណបើកប្រាក់
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);

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
      console.error("Error fetching teacher data:", error);
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
        const itemData = item['ឈ្មោះគ្រូ'] ? item['ឈ្មោះគ្រូ'].toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
    } else {
      setFilteredData(data);
    }
  };

  // មុខងារពេលចុចលើឈ្មោះគ្រូ
  const handlePressTeacher = (teacher: any) => {
    setSelectedTeacher(teacher);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: any }) => (
    // ដូរពី View ទៅ TouchableOpacity ដើម្បីឱ្យចុចបាន
    <TouchableOpacity 
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => handlePressTeacher(item)}
    >
      <View style={styles.headerRow}>
        <View style={styles.iconContainer}>
            <Text style={styles.icon}>{item['ភេទ'] === 'Male' ? '👨‍🏫' : '👩‍🏫'}</Text>
        </View>
        <View style={{flex: 1}}>
            <Text style={styles.teacherName}>{item['ឈ្មោះគ្រូ']}</Text>
            <Text style={styles.subText}>{item['ខែ'] || 'មិនបញ្ជាក់ខែ'}</Text>
        </View>
        
        <View style={[styles.genderBadge, { backgroundColor: item['ភេទ'] === 'Male' ? '#E3F2FD' : '#FCE4EC' }]}>
            <Text style={[styles.genderText, { color: item['ភេទ'] === 'Male' ? '#1976D2' : '#E91E63' }]}>
                {item['ភេទ']}
            </Text>
        </View>
      </View>
      
      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>សិស្សសរុប:</Text>
        <Text style={styles.value}>{item['ចំនួនសិស្ស']} នាក់</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>ចំណែកគ្រូ (80%):</Text>
        <Text style={[styles.value, { color: '#1565C0', fontSize: 15 }]}>{item['ថវិកាគ្រូ 80%']}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>បញ្ជីឈ្មោះគ្រូ 👱‍♀️🏫</Text>
        <Text style={{color: 'gray', fontSize: 12}}>គ្រូបង្រៀនសរុប: {data.length} នាក់</Text>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <TextInput 
          style={styles.searchInput}
          placeholder="🔍 ស្វែងរកឈ្មោះគ្រូ..."
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1565C0" />
            <Text style={{marginTop: 10, color: 'gray'}}>កំពុងទាញទិន្នន័យគ្រូ...</Text>
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

      {/* 👇 នេះគឺ Modal ផ្ទាំងបណ្ណបើកប្រាក់ដែល Boss ចង់បាន */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedTeacher && (
              <>
                <View style={styles.slipHeader}>
                    <Text style={styles.slipTitle}>បណ្ណបើកប្រាក់ 💵</Text>
                    <Text style={styles.slipDate}>សម្រាប់ខែ: {selectedTeacher['ខែ'] || '...'}</Text>
                </View>

                <View style={styles.slipDivider} />

                <View style={styles.slipRow}>
                    <Text style={styles.slipLabel}>ឈ្មោះលោកគ្រូ/អ្នកគ្រូ:</Text>
                    <Text style={styles.slipValueBold}>{selectedTeacher['ឈ្មោះគ្រូ']}</Text>
                </View>
                <View style={styles.slipRow}>
                    <Text style={styles.slipLabel}>ចំនួនសិស្សសរុប:</Text>
                    <Text style={styles.slipValue}>{selectedTeacher['ចំនួនសិស្ស']} នាក់</Text>
                </View>
                <View style={styles.slipRow}>
                    <Text style={styles.slipLabel}>ថវិកាប្រមូលបានសរុប:</Text>
                    <Text style={styles.slipValue}>{selectedTeacher['ថវិកាប្រមូលបាន']}</Text>
                </View>

                {/* បន្ទាត់ចុចៗ */}
                <View style={[styles.slipDivider, { borderStyle: 'dashed' }]} />

                <View style={styles.slipRow}>
                    <Text style={styles.slipLabel}>ចំណែកសាលា (20%):</Text>
                    <Text style={[styles.slipValue, { color: '#E65100' }]}>{selectedTeacher['ថវិកាសាលា20%'] || selectedTeacher['ថវិកាសាលា 20%']}</Text>
                </View>
                
                <View style={[styles.slipRow, { marginTop: 10, backgroundColor: '#E3F2FD', padding: 10, borderRadius: 8 }]}>
                    <Text style={[styles.slipLabel, { color: '#1565C0', fontWeight: 'bold' }]}>ប្រាក់ត្រូវបើក (80%):</Text>
                    <Text style={styles.slipHighlight}>{selectedTeacher['ថវិកាគ្រូ 80%']}</Text>
                </View>

                <TouchableOpacity 
                    style={styles.closeBtn}
                    onPress={() => setModalVisible(false)}
                >
                    <Text style={styles.closeBtnText}>បិទបណ្ណ (Close)</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { padding: 20, paddingTop: 50, backgroundColor: 'white', paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1565C0' },
  
  searchInput: {
    backgroundColor: 'white', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 25, fontSize: 16,
    borderWidth: 1, borderColor: '#E3F2FD', marginTop: 15, marginBottom: 5, elevation: 3, shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3,
  },
  
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  card: { backgroundColor: 'white', borderRadius: 16, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, marginHorizontal: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconContainer: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  icon: { fontSize: 22 },
  teacherName: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  subText: { fontSize: 12, color: 'gray', marginTop: 2 },
  
  genderBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 },
  genderText: { fontWeight: 'bold', fontSize: 11 },
  
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' },
  label: { color: 'gray', fontSize: 13 },
  value: { fontWeight: 'bold', fontSize: 13, color: '#333' },

  // 👇 Style សម្រាប់ Modal បណ្ណបើកប្រាក់
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 25, elevation: 10, shadowColor: '#000', shadowOffset: {width: 0, height: 5}, shadowOpacity: 0.3, shadowRadius: 10 },
  slipHeader: { alignItems: 'center', marginBottom: 15 },
  slipTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  slipDate: { fontSize: 14, color: 'gray' },
  slipDivider: { height: 1, backgroundColor: '#ddd', marginVertical: 15 },
  slipRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  slipLabel: { fontSize: 14, color: '#555' },
  slipValue: { fontSize: 14, color: '#333', fontWeight: '500' },
  slipValueBold: { fontSize: 16, color: '#333', fontWeight: 'bold' },
  slipHighlight: { fontSize: 18, color: '#1565C0', fontWeight: 'bold' },
  closeBtn: { marginTop: 25, backgroundColor: '#1565C0', padding: 15, borderRadius: 12, alignItems: 'center' },
  closeBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});