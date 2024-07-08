def mergeByDate(array1, array2, key):
    combined_dict = {}
    for obj in array1:
        combined_dict[obj[key]] = obj
    for obj in array2:
        if obj[key] in combined_dict:
            combined_dict[obj[key]].update(obj)
        else:
            combined_dict[obj[key]] = obj
    combined_array = list(combined_dict.values())
    return combined_array