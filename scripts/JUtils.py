#-------------------------------------------------#
#           John D. Aynedjian 8/22/2018           #
#-------------------------------------------------#

import os
import re

class JUtils(object): # always inherit from object...it's just a good idea...

    VERSION = '1.5.1'

    @staticmethod
    def find(a_output, s_dir_path, s_file_pattern="", i_max_recursion_level=0, i_recursion_level=1): 
        sWho = "JUtils.find"
        print(sWho +"(): s_dir_path=\"" + s_dir_path + "\"")
        print(sWho +"(): s_file_pattern=\"" + s_file_pattern + "\"")
        print(sWho +"(): i_max_recursion_level =" + str(i_max_recursion_level) ) 
        print(sWho +"(): i_recursion_level =" + str(i_recursion_level) )

        if i_recursion_level > i_max_recursion_level:
            print(sWho +"(): i_recursion_level =" + str(i_recursion_level) + " has exceeded i_max_recursion_level = " + str(i_max_recursion_level ) + ", so exiting now...")
            return

        i_count = 0

        if s_file_pattern:
            re_file_regex = re.compile(s_file_pattern) 
        else:
            re_file_regex = None

        for name in os.listdir(s_dir_path):
            i_count += 1
            print(sWho +"(): " + str(i_count) + ": name=\""+name+"\"")
            path = os.path.join(s_dir_path, name)
            print(sWho +"(): " + str(i_count) + ": path=\""+path+"\"")

            if os.path.isfile(path):
                if re_file_regex is None or re_file_regex.match(name):
                    a_output.append(path)
            else:
                JUtils.find(self, path, s_file_pattern, i_max_recursion_level, a_output, i_recursion_level+1) 


    # Pass one element match_array[] to simulate
    # "output" parameter...match_array[0] will
    # be filled in with the match object...
    @staticmethod
    def matchete( my_regex, s_input, match_array ):
        match = my_regex.match(s_input)
        match_array[0] = match
        return match

def array_grep(input_array, regex):
    output_array = []
    for el in input_array:    
        if regex.match( el ): 
            output_array.append( el )            
    return output_array

def array_to_string( array ):
    return ', '.join( array )


