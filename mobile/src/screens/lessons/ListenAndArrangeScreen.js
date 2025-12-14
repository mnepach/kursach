import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import Sizes from '../../constants/sizes';
import Button from '../../components/common/Button';
import WordButton from '../../components/lesson/WordButton';
import ProgressBar from '../../components/lesson/ProgressBar';

const ListenAndArrangeScreen = ({ route, navigation }) => {
  const { lesson, currentIndex, totalLessons } = route.params;
  const [selectedWords, setSelectedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const shuffled = [...lesson.words].sort(() => Math.random() - 0.5);
    setAvailableWords(shuffled);
    setSelectedWords([]);
    setChecked(false);
    setIsCorrect(false);
  }, [lesson]);

  const handleWordClick = (word, fromAvailable) => {
    if (checked) return;
    
    if (fromAvailable) {
      setSelectedWords([...selectedWords, word]);
      setAvailableWords(availableWords.filter(w => w !== word));
    } else {
      setAvailableWords([...availableWords, word]);
      setSelectedWords(selectedWords.filter(w => w !== word));
    }
  };

  const playAudio = () => {
    console.log('Play audio:', lesson.audio);
  };

  const handleCheck = () => {
    if (checked) {
      navigation.goBack();
    } else {
      const userAnswer = selectedWords.join(' ');
      const correct = userAnswer === lesson.correctAnswer;
      setIsCorrect(correct);
      setChecked(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={28} color={Colors.textDark} />
        </TouchableOpacity>
        
        <ProgressBar current={currentIndex + 1} total={totalLessons} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Составьте из слов предложение</Text>
          <Text style={styles.subtitle}>Прослушайте фразу и составьте предложение</Text>

          <TouchableOpacity 
            style={styles.audioButton}
            onPress={playAudio}
          >
            <Ionicons name="volume-high" size={40} color={Colors.white} />
          </TouchableOpacity>

          <View style={[
            styles.selectedArea,
            checked && (isCorrect ? styles.correctArea : styles.incorrectArea)
          ]}>
            {selectedWords.length === 0 ? (
              <Text style={styles.placeholder}>Выберите слова снизу...</Text>
            ) : (
              <View style={styles.wordsContainer}>
                {selectedWords.map((word, index) => (
                  <WordButton
                    key={`selected-${index}`}
                    word={word}
                    onPress={() => handleWordClick(word, false)}
                    disabled={checked}
                    variant={checked ? (isCorrect ? 'selected' : 'selected') : 'selected'}
                  />
                ))}
              </View>
            )}
          </View>

          {checked && !isCorrect && (
            <View style={styles.correctAnswerBox}>
              <Text style={styles.correctAnswerLabel}>Правильный ответ:</Text>
              <Text style={styles.correctAnswerText}>{lesson.correctAnswer}</Text>
            </View>
          )}

          <View style={styles.availableArea}>
            <View style={styles.wordsContainer}>
              {availableWords.map((word, index) => (
                <WordButton
                  key={`available-${index}-${word}`}
                  word={word}
                  onPress={() => handleWordClick(word, true)}
                  disabled={checked}
                  variant="available"
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={checked ? 'Далее' : 'Проверить'}
          onPress={handleCheck}
          disabled={selectedWords.length === 0}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgLight,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: Colors.white,
    paddingBottom: Sizes.padding.small,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    padding: Sizes.padding.medium,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: Sizes.padding.large,
  },
  title: {
    fontSize: Sizes.fontSize.xlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: Sizes.margin.small,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Sizes.fontSize.medium,
    color: Colors.textLight,
    marginBottom: Sizes.margin.xlarge,
    textAlign: 'center',
  },
  audioButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: Sizes.margin.xlarge,
  },
  selectedArea: {
    minHeight: 100,
    backgroundColor: Colors.white,
    borderRadius: Sizes.borderRadius.large,
    padding: Sizes.padding.large,
    marginBottom: Sizes.margin.large,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  correctArea: {
    borderColor: Colors.success,
    backgroundColor: '#F0FDF4',
  },
  incorrectArea: {
    borderColor: Colors.error,
    backgroundColor: '#FEF2F2',
  },
  placeholder: {
    fontSize: Sizes.fontSize.medium,
    color: Colors.textLight,
    textAlign: 'center',
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  correctAnswerBox: {
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: Colors.success,
    borderRadius: Sizes.borderRadius.large,
    padding: Sizes.padding.large,
    marginBottom: Sizes.margin.large,
  },
  correctAnswerLabel: {
    fontSize: Sizes.fontSize.medium,
    fontWeight: 'bold',
    color: Colors.success,
    marginBottom: Sizes.margin.small,
  },
  correctAnswerText: {
    fontSize: Sizes.fontSize.large,
    color: Colors.textDark,
  },
  availableArea: {
    backgroundColor: Colors.white,
    borderRadius: Sizes.borderRadius.large,
    padding: Sizes.padding.large,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  footer: {
    padding: Sizes.padding.large,
    paddingBottom: Platform.OS === 'ios' ? Sizes.padding.xlarge : Sizes.padding.large,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});

export default ListenAndArrangeScreen;