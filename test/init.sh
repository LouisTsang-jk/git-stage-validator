TEMP_TEST_PATH=test/.temp_test_repo
TEST_FILE_DIR_PATH=test/test_template/
# Clear Temp File
if [ -d $TEMP_TEST_PATH ]; then
  rm -rf $TEMP_TEST_PATH
fi
# Create Temp Test Dir
mkdir $TEMP_TEST_PATH
cp -r $TEST_FILE_DIR_PATH $TEMP_TEST_PATH
cd test/.temp_test_repo 
git init
git add .
git diff --diff-filter=AM --cached --name-only
