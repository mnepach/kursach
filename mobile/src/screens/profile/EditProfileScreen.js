import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const EditProfileScreen = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Ошибка', 'Необходимо разрешение на доступ к галерее');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Введите имя');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await updateUser({ name: name.trim(), avatar });
      Alert.alert('Успешно', 'Профиль обновлен', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      setError(err.message || 'Ошибка при обновлении профиля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color={Colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Редактировать профиль</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: avatar || 'https://via.placeholder.com/150' }}
              style={styles.avatar}
            />
            <View style={styles.cameraButton}>
              <Ionicons name="camera" size={22} color={Colors.white} />
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.avatarHint}>Нажмите на аватар, чтобы изменить фото</Text>

        <View style={styles.form}>
          <Input
            label="Имя"
            value={name}
            onChangeText={setName}
            placeholder="Ваше имя"
            error={error}
            labelStyle={styles.inputLabel}
            inputStyle={styles.inputText}
          />

          <Input
            label="Email"
            value={user?.email}
            editable={false}
            labelStyle={styles.inputLabel}
            inputStyle={styles.emailText}
            containerStyle={styles.emailContainer}
          />

          <Text style={styles.emailHint}>Email нельзя изменить</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.buttonRow}>
          <Button
            title="Отмена"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.halfButton}
          />
          <Button
            title="Сохранить"
            onPress={handleSave}
            loading={loading}
            disabled={!name.trim()}
            style={styles.halfButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizes.padding.large,
    paddingVertical: Sizes.padding.medium,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    marginRight: Sizes.margin.small,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'left',
  },
  scrollContent: {
    padding: Sizes.padding.large,
    paddingBottom: Sizes.padding.xlarge + 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: Sizes.margin.small,
  },
  avatarWrapper: {
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: Colors.primary,
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  avatarHint: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Sizes.margin.xlarge,
  },
  form: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  inputText: {
    fontSize: 18,
  },
  emailContainer: {
    backgroundColor: Colors.white,
  },
  emailText: {
    fontSize: 18,
    color: Colors.textLight,
    opacity: 0.8,
  },
  emailHint: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: -Sizes.margin.small,
    marginBottom: Sizes.margin.medium,
  },
  footer: {
    padding: Sizes.padding.large,
    paddingBottom: Platform.OS === 'ios' ? Sizes.padding.xlarge : Sizes.padding.large,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Sizes.margin.medium,
  },
  halfButton: {
    flex: 1,
  },
});

export default EditProfileScreen;
