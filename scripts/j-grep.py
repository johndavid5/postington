#
#For example...
#
#  py j-grep.py <filename>
#

import re
import sys 
from JLogger import JLogger
from JUtils import JUtils

logger = JLogger()

def main():
    
    VERSION="1.0.0"
    DATE="8/14/2018"

    logger.info("j-grep.py VERSION=%s, DATE=%s" % (VERSION, DATE) )
    
    logger.debug("len(sys.argv) = %d" % len(sys.argv) )
    
    a_input_files = []
    b_listing_files = False
    s_debug_level = "INFO"

    s_dir_path = ""
    s_file_pattern = ""
    b_recursive = False
    i_max_recursion_level = 0

    global PROG_PATH 
    PROG_PATH = sys.argv[0]

    i = 1
    #for i in range(len(sys.argv)):
    while i < len(sys.argv):
        print("sys.argv[%d]=\"%s\""%(i, sys.argv[i]))

        if sys.argv[i].lower() == "-dbg":
            i += 1
            s_debug_level = sys.argv[i]
        elif sys.argv[i].lower() == "-d":
            i += 1
            s_dir_path = sys.argv[i]
        elif sys.argv[i].lower() == "-p":
            i += 1
            s_file_pattern = sys.argv[i]
        elif sys.argv[i].lower().find("-r") == 0:
            b_recursive = True
            i_max_recursion_level = int(sys.argv[i][2:])
        else:
            a_input_files.append( sys.argv[i] )

        i += 1
    
#        if sys.argv[i].lower() == "-h":
#            i += 1
#            s_heading = sys.argv[i]
#        elif sys.argv[i].lower() == "-t":
#            i += 1
#            arr_s_text.append(sys.argv[i])

            
    logger.debug("s_debug_level = \"%s\"" % s_debug_level )
    #print("logger.getLevel() = ", logger.getLevel() )
    logger.debug("Calling logger.setLevelString(\"" + s_debug_level + "\")...");
    logger.setLevelString(s_debug_level)
    logger.debug("s_debug_level = \"%s\"" % s_debug_level )
    #print("logger.getLevel() = ", logger.getLevel() )

    #logger.debug("s_input_file = \"%s\"" % s_input_file )
    logger.debug("a_input_files = \"%s\"" % a_input_files )

    logger.debug("s_dir_path = \"%s\"" % s_dir_path )
    logger.debug("s_file_pattern = \"%s\"" % s_file_pattern )
    logger.debug("b_recursive = {}".format(b_recursive) )
    logger.debug("i_max_recursion_level = {}".format(i_max_recursion_level) )

    JUtils.find( a_input_files, s_dir_path, s_file_pattern, i_max_recursion_level )

    logger.debug("After lookup_files(), a_input_files = \"%s\"" % a_input_files )

    for i in range(len(a_input_files)):
        s_input_file = a_input_files[i]
        logger.debug("i=%d: Calling do_a_file( s_input_file = \"%s\" )..." % (i, s_input_file) )
        try:
            do_a_file( s_input_file )
        except FileNotFoundError as error:
            logger.error("FileNotFoundError during do_a_file(\"" + s_input_file + "\"): " + str(error))

    logger.info("Let off some steam, Bennett!")

# end main()    

def lookup_files( s_dir_path, s_file_pattern, b_recursive, i_max_recursion_level ):
    sWho = "do_a_file"
    
# end lookup_files()

# for example...
#<!--Named annotation set--><AnnotationSet Name="Internal Reference">
#<Annotation Id="1605" Type="autoref" StartNode="1360" EndNode="1373">
#<Feature>
#  <Name className="java.lang.String">href</Name>
#  <Value className="java.lang.String">/ca/osfisanctions/Special Economic Measures (Burma) Regulations/a</Value>
#</Feature>
#</Annotation>
#...
#</AnnotationSet>
def do_a_file(s_input_file):

    sWho = "do_a_file"

    global PROG_PATH

    print(s_input_file + "...")

    logger.debug(sWho + "(): PROG_PATH = \"" + PROG_PATH + "\"")

    logger.debug(sWho + "(): Calling open( s_input_file = \"%s\" )..." % s_input_file )

    fh_in = open( s_input_file, mode="r", encoding="utf8" ) 
    
    i_count = 0
    s_line = ""
    max_line = -1
    match_array = [None]
    match = None
    
    # "x" marks the spot for failed Jest test: "×" = U+00D7
    # "bullet" for failed Jest suite: "●" = U+25CF
    re_bullet_or_times = re.compile(".*[×●].*", re.IGNORECASE)
    logger.debug("re_bullet_or_times = \"%s\"" % (re_bullet_or_times) )

    for s_line in fh_in:
    
            i_count += 1
    
            logger.trace("line[%d] = \"%s\"" % (i_count, s_line) )

            if max_line > -1 and i_count > max_line:
                logger.trace("line_count is greater than max_line=%d, breaking out of for loop..." % max_line )
                break

                if JUtils.matchete( re_bullet_or_times, s_line, match_array ):
                    logger.trace("line[%d]: It's a match to re_bullet_or_times, Moe, match_array[0] = %s..." % ( i_count, match_array[0] ) )
                    logger.trace("line[%d]: It's a match to re_bullet_or_times, Moe, match_array[0].group() = %s..." % ( i_count, match_array[0].group() ) )
                else:  
                    logger.trace("line[%d]: Sorry, Moe, ain't got a match to re_bullet_or_times...")

    # end do_a_file ()
    

############
# end main #
############

#names = ['aet2000','ppt2000', 'aet2001', 'ppt2001']
#found = []
#for name in names:
#    if 'aet' in name:
#       found.append(name)
#print found


## <testing> ###

def master_demo():
    logger_demo()
    array_grep_demo()

def array_grep_demo():
    s_who = "array_grep_demo"
    names_array = ['aet2000','ppt2000', 'aet2001', 'ppt2001', 'ppt20', 'pptx']
    p_alpha = re.compile("^ppt\\d{4}", re.IGNORECASE)
    output_array = utils.array_grep( names_array, p_alpha )    
    logger.info("%s(): output_array = [%s]", s_who, array_to_string(output_array))

def logger_demo():
    logger.debug('debug message')
    logger.info('info message')
    logger.warn('warn message')
    logger.error('error message')
    logger.critical('critical message')

## </testing> ###

# Automatically kick-start main()...
# https://stackoverflow.com/questions/1590608/is-it-possible-to-forward-declare-a-function-in-python
if __name__=="__main__":
   main()
