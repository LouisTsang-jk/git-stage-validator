TEMP_TEST_PATH=test/.temp_test_repo
TEST_FILE_DIR_PATH=test/test_template/
# Clear Temp File
if [ -d $TEMP_TEST_PATH ]; then
  rm -rf $TEMP_TEST_PATH
fi
# Create Temp Test Dir
mkdir $TEMP_TEST_PATH
cp -r $TEST_FILE_DIR_PATH $TEMP_TEST_PATH
# 

i=1

while [ $i -le 6 ]
do
    echo $i
    cp -r $TEST_FILE_DIR_PATH/large.js $TEMP_TEST_PATH/large_$i.js
    i=$((i+1))
done

# 
cd test/.temp_test_repo 
git init
git add .
# git diff --diff-filter=AM --cached --name-only

# vim $TEMP_TEST_PATH/.git/pre-commit

node ../../src/index.ts < /dev/tty
# node ../../src/index.ts < /dev/tty

# Clear Test File
# rm -rf $TEMP_TEST_PATH